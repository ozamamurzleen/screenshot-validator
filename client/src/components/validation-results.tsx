import { ValidationResultsProps } from "@/lib/types";
import { CheckCircle, XCircle } from "lucide-react";

export function ValidationResults({ results, isVisible }: ValidationResultsProps) {
  if (!isVisible || !results) return null;

  return (
    <div className="mx-6 mb-6">
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-lg font-medium mb-4">Validation Results</h3>
        
        {/* Status Banner */}
        {results.isApproved ? (
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Screenshot Accepted</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>{results.comments}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Screenshot Rejected</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{results.comments}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Guidelines Checklist */}
        <div className="space-y-3 mb-6">
          {results.guidelines.map((guideline, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="h-5 w-5 flex items-center justify-center">
                  {guideline.status === "passed" ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                </span>
              </div>
              <div className="ml-3 text-sm">
                <p className="font-medium text-gray-700">{guideline.title}</p>
                <p className="text-gray-500">{guideline.description}</p>
                {guideline.status === "failed" && (
                  <p className="mt-1 text-sm text-red-600">{guideline.recommendation}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Improvement Actions */}
        {results.improvementActions.length > 0 && !results.isApproved && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {results.improvementActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
