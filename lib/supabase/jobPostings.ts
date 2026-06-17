// lib/supabase/jobPostings.ts

import { createClient } from '@/lib/supabase/client';
import { JobPosting, JobPostingWithStatus } from './types';

export async function getJobPostingsForManager(managerId: string): Promise<JobPostingWithStatus[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('job_postings')
    .select(`
      *,
      approval_requests (
        status,
        approval_pdf_path
      )
    `)
    .eq('manager_id', managerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching job postings:', error);
    throw error;
  }

  // Transform the data to match our display format
  return data.map((item: any) => ({
    ...item,
    approval_status: item.approval_requests?.status || null,
    approval_pdf_path: item.approval_requests?.approval_pdf_path || null,
  }));
}

export async function getJobPostingById(jobPostingId: string): Promise<JobPosting | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('job_postings')
    .select('*')
    .eq('job_posting_id', jobPostingId)
    .single();

  if (error) {
    console.error('Error fetching job posting:', error);
    return null;
  }

  return data;
}

// Optional: Generate a signed URL for PDF access
export async function getSignedPdfUrl(pdfPath: string): Promise<string | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .storage
      .from('job_postings') // Your bucket name
      .createSignedUrl(pdfPath, 3600); // 1 hour expiry
    
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
}