export interface JobPosting {
    job_posting_id: string;
    manager_id: string;
    request_id: string;
    title: string;
    job_posting_pdf_path: string;
    created_at: string;
  }
  
  export interface ApprovalRequest {
    request_id: string;
    manager_id: string;
    director_id: string;
    status: 'pending' | 'approved' | 'rejected';
    approval_pdf_path: string | null;
    comment: string | null;
    created_at: string;
    reviewed_at: string | null;
  }
  
  export interface Profile {
    profile_id: string;
    auth_user_id: string;
    role: string;
    email: string;
    created_at: string;
  }
  
  // For the page display (combining job posting with approval status)
  export interface JobPostingWithStatus extends JobPosting {
    approval_status: string | null;
    approval_pdf_path: string | null;
  }