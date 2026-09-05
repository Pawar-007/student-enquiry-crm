import { getRevenue } from '../../api/paymentApi';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import { SkeletonStat } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import { formatCurrency } from '../../utils/format';
import { Wallet, TrendingUp } from 'lucide-react';

export default function Revenue() {
  const { data, loading, error, refetch } = useApi(getRevenue, []);

  // Backend may return a plain number/BigDecimal or an object — handle both
  // without inventing fields the API doesn't actually provide.
  const totalRevenue = typeof data === 'object' && data !== null ? data.totalRevenue ?? data.revenue : data;

  return (
    <div>
      <PageHeader title="Revenue" description="Total revenue collected across all enrollments." />

      {loading && (
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <SkeletonStat />
        </div>
      )}

      {error && !loading && <ErrorState message={error.message} onRetry={refetch} />}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={Wallet} tone="success" />
        </div>
      )}

      <div className="mt-8 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-6 flex items-start gap-3">
        <TrendingUp size={18} className="text-[var(--color-muted)] mt-0.5" />
        <p className="text-sm text-[var(--color-muted)]">
          For a payment-by-payment breakdown, look up an individual enrollment from the Payments page.
        </p>
      </div>
    </div>
  );
}
