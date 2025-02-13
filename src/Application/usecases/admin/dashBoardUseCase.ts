import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';
import { SpamRepository } from '../../../Domain/repository/repo/spamRepository';
import { JobPostRepository } from '../../../Domain/repository/repo/jobPostRepository';
import { JobApplicationRepository } from '../../../Domain/repository/repo/jobApplicationRepository';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DashboardStats {
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

export class DashboardUseCase {
  constructor(
    private userRepository: UserRepository,
    private companyRepository: CompanyRepository,
    private spamRepository: SpamRepository,
    private jobPostRepository: JobPostRepository,
    private jobApplicationRepository: JobApplicationRepository
  ) {}

  async execute(dateRange?: {
    startDate: string;
    endDate: string;
  }): Promise<DashboardStats> {
    try {
      const dateQuery = dateRange
        ? {
            createdAt: {
              $gte: new Date(dateRange.startDate),
              $lte: new Date(dateRange.endDate),
            },
          }
        : {};

      const [
        totalUsers,
        totalCompanies,
        premiumUsers,
        spamUsers,
        totalJobs,
        totalApplications,
      ] = await Promise.all([
        this.userRepository.countTotal(dateQuery),
        this.companyRepository.countTotal(dateQuery),
        this.userRepository.countPremium(dateQuery),
        this.spamRepository.countTotal(dateQuery),
        this.jobPostRepository.countTotal(dateQuery),
        this.jobApplicationRepository.countTotal(dateQuery),
      ]);

      const [growthRate, monthlyGrowth, applicationStatus] = await Promise.all([
        this.calculateGrowthRates(dateRange),
        this.getMonthlyGrowthData(dateRange),
        this.jobApplicationRepository.getStatusDistribution(dateQuery),
      ]);

      const regularUsers = totalUsers - premiumUsers - spamUsers;
      const userTypeDistribution = [
        { name: 'Regular Users', value: regularUsers },
        { name: 'Premium Users', value: premiumUsers },
        { name: 'Spam Users', value: spamUsers },
      ];

      return {
        totalUsers,
        totalCompanies,
        premiumUsers,
        spamUsers,
        totalJobs,
        totalApplications,
        growthRate,
        monthlyGrowth,
        userTypeDistribution,
        applicationStatus,
      };
    } catch (error) {
      console.error('Dashboard error:', error);
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to fetch dashboard statistics'
      );
    }
  }

  private async calculateGrowthRates(dateRange?: {
    startDate: string;
    endDate: string;
  }) {
    const { currentQuery, previousQuery } =
      this.getGrowthDateQueries(dateRange);

    const [currentStats, previousStats] = await Promise.all([
      this.getPeriodStats(currentQuery),
      this.getPeriodStats(previousQuery),
    ]);

    return {
      users: this.calculateGrowthPercentage(
        currentStats.users,
        previousStats.users
      ),
      companies: this.calculateGrowthPercentage(
        currentStats.companies,
        previousStats.companies
      ),
      premium: this.calculateGrowthPercentage(
        currentStats.premium,
        previousStats.premium
      ),
      spam: this.calculateGrowthPercentage(
        currentStats.spam,
        previousStats.spam
      ),
      jobs: this.calculateGrowthPercentage(
        currentStats.jobs,
        previousStats.jobs
      ),
      applications: this.calculateGrowthPercentage(
        currentStats.applications,
        previousStats.applications
      ),
    };
  }

  private getGrowthDateQueries(dateRange?: {
    startDate: string;
    endDate: string;
  }) {
    let currentStart: Date,
      currentEnd: Date,
      previousStart: Date,
      previousEnd: Date;

    if (dateRange) {
      currentStart = new Date(dateRange.startDate);
      currentEnd = new Date(dateRange.endDate);
      const duration = currentEnd.getTime() - currentStart.getTime();
      previousStart = new Date(currentStart.getTime() - duration);
      previousEnd = new Date(currentStart.getTime());
    } else {
      currentEnd = new Date();
      currentStart = new Date(
        currentEnd.getFullYear(),
        currentEnd.getMonth(),
        1
      );
      previousEnd = new Date(
        currentEnd.getFullYear(),
        currentEnd.getMonth(),
        0
      );
      previousStart = new Date(
        previousEnd.getFullYear(),
        previousEnd.getMonth(),
        1
      );
    }

    return {
      currentQuery: {
        createdAt: { $gte: currentStart, $lte: currentEnd },
      },
      previousQuery: {
        createdAt: { $gte: previousStart, $lte: previousEnd },
      },
    };
  }

  private async getPeriodStats(query: any) {
    try {
      const [users, companies, premium, spam, jobs, applications] =
        await Promise.all([
          this.userRepository.countTotal(query),
          this.companyRepository.countTotal(query),
          this.userRepository.countPremium(query),
          this.spamRepository.countTotal(query),
          this.jobPostRepository.countTotal(query),
          this.jobApplicationRepository.countTotal(query),
        ]);

      return { users, companies, premium, spam, jobs, applications };
    } catch (error) {
      console.error('Error getting period stats:', error);
      return {
        users: 0,
        companies: 0,
        premium: 0,
        spam: 0,
        jobs: 0,
        applications: 0,
      };
    }
  }

  private calculateGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  private async getMonthlyGrowthData(dateRange?: {
    startDate: string;
    endDate: string;
  }) {
    const months = [];
    const endDate = dateRange ? new Date(dateRange.endDate) : new Date();
    const startDate = dateRange
      ? new Date(dateRange.startDate)
      : new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);

    startDate.setDate(1);
    endDate.setHours(23, 59, 59, 999);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const monthQuery = {
        createdAt: { $gte: monthStart, $lte: monthEnd },
      };

      const [users, companies, jobs, applications] = await Promise.all([
        this.userRepository.countTotal(monthQuery),
        this.companyRepository.countTotal(monthQuery),
        this.jobPostRepository.countTotal(monthQuery),
        this.jobApplicationRepository.countTotal(monthQuery),
      ]);

      months.push({
        name: monthStart.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        }),
        users,
        companies,
        jobs,
        applications,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  }
}
