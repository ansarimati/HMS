export default function InsuranceInfoCard({ insuranceInfo }) {
  if (!insuranceInfo) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">No insurance information available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label className="font-medium">Provider</label>
          <p className="text-gray-700">{insuranceInfo.provider || 'Not specified'}</p>
        </div>
        
        <div>
          <label className="font-medium">Policy Number</label>
          <p className="text-gray-700">{insuranceInfo.policyNumber || 'Not specified'}</p>
        </div>
        
        <div>
          <label className="font-medium">Group Number</label>
          <p className="text-gray-700">{insuranceInfo.groupNumber || 'Not specified'}</p>
        </div>
        
        {insuranceInfo.validUntil && (
          <div>
            <label className="font-medium">Valid Until</label>
            <p className="text-gray-700">
              {new Date(insuranceInfo.validUntil).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}