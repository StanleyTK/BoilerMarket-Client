import React from "react";

interface ReportCardProps {
  report: Report;
}

interface Report {
  title: string;
  description: string;
  reported_uid: string;
  uid: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 w-full max-w-md">
      <div className="text-xl font-semibold text-gray-800 mb-2">{report.title}</div>
      <div className="text-gray-600 mb-4">{report.description}</div>
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">Reported By:</span> {report.reported_uid}
      </div>
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">User Reported:</span> {report.uid}
      </div>
    </div>
  );
};

export default ReportCard;