import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Supabase client
import AWS from 'aws-sdk';
import { User } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const supabase = createClient();

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = userData.user;

  const oid = searchParams.get('oid');

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('oid', oid)
    .single();

    console.log(error)

  if (error || !project) {
    return new NextResponse('Project not found', { status: 404 });
  }

  // Check if the project belongs to the authenticated user
  if (project.user_id !== user.id) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Fetch S3 object using project ID or any key related to the project
  const s3 = new AWS.S3({
    region: 'ap-northeast-1',
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: 'plotter-production-private',
    Key: `${project.oid}/data.json`, // Assuming the object is stored with project oid as a key
  };

  try {
    const s3Data = await s3.getObject(params).promise();
    const content: any = s3Data.Body?.toString('utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (err:any) {
    if (err.code === 'NoSuchKey') {
      // Object not found, create it with default content
      const defaultParams = {
        Bucket: 'plotter-production-private',
        Key: 'example.json',
      };

      try {
        const defaultData = await s3.getObject(defaultParams).promise();
        const defaultContent: any = defaultData.Body?.toString('utf-8');
        
        const createParams = {
          Bucket: 'plotter-production-private',
          Key: `${project.oid}/data.json`,
          Body: defaultContent,
          ContentType: 'application/json',
        };

        await s3.putObject(createParams).promise();
        return NextResponse.json(JSON.parse(defaultContent));
      } catch (createErr) {
        console.error('Error creating new S3 object:', createErr);
        return new NextResponse('Error creating file', { status: 500 });
      }
    } else {
      console.error('Error fetching S3 object:', err);
      return new NextResponse('Error fetching file', { status: 500 });
    }
  }
}