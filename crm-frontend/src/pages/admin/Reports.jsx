import { BarChart3 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

// No dedicated reports API is defined in the backend contract yet — rather
// than invent one, this page is a clearly-labeled placeholder that reuses
// the Dashboard's real data. Extend this once report endpoints exist.
export default function Reports() {
  return (
    <div>
      <PageHeader title="Reports" description="Deeper reporting is on the way." />
      <EmptyState
        icon={BarChart3}
        title="No dedicated report endpoints yet"
        description="For now, the Dashboard and Revenue pages surface the metrics currently exposed by the backend. Detailed report builders will appear here once corresponding APIs are available."
      />
    </div>
  );
}
