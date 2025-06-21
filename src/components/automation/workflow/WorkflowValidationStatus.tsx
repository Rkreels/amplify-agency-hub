
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface WorkflowValidationStatusProps {
  validation: ValidationResult;
  onClose: () => void;
}

export function WorkflowValidationStatus({ validation, onClose }: WorkflowValidationStatusProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {validation.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Workflow Validation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={validation.isValid ? "default" : "destructive"}>
              {validation.isValid ? "Valid" : "Invalid"}
            </Badge>
            <span className="text-sm text-gray-600">
              {validation.isValid ? "Workflow is ready to activate" : `${validation.errors.length} issues found`}
            </span>
          </div>

          {validation.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Issues to Fix:</h4>
              <div className="space-y-1">
                {validation.errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
