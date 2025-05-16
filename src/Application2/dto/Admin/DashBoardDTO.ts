export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  premiumUsers: number;
  spamUsers: number;
  totalJobs: number;
  totalApplications: number;
  growthRate: {
    users: number;
    companies: number;
    premium: number;
    spam: number;
    jobs: number;
    applications: number;
  };
  monthlyGrowth: Array<{
    name: string;
    users: number;
    companies: number;
    jobs: number;
    applications: number;
  }>;
  userTypeDistribution: Array<{
    name: string;
    value: number;
  }>;

  applicationStatus: Array<{
    name: string;
    value: number;
  }>;
}