
import { useEffect } from 'react';
import { useWorkflowStore, WorkflowExecution, ActionConfig } from '@/store/useWorkflowStore';
import { toast } from 'sonner';

export function WorkflowExecutionEngine() {
  const { currentWorkflow, executionLogs } = useWorkflowStore();

  useEffect(() => {
    console.log('WorkflowExecutionEngine initialized');
  }, []);

  // Comprehensive action execution handler
  const executeAction = async (actionConfig: ActionConfig, contactData: any): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      console.log(`Executing action: ${actionConfig.type}`, { actionConfig, contactData });

      // Normalize action type for consistent handling
      const actionType = actionConfig.type.replace(/-/g, '_');

      switch (actionType) {
        // Communication Actions
        case 'send_email':
          return await executeSendEmail(actionConfig, contactData);
        
        case 'send_sms':
          return await executeSendSMS(actionConfig, contactData);
        
        case 'send_notification':
        case 'send_internal_notification':
          return await executeSendNotification(actionConfig, contactData);
        
        case 'send_review_request':
          return await executeSendReviewRequest(actionConfig, contactData);

        // Contact Management Actions
        case 'add_tag':
        case 'add_contact_tag':
          return await executeAddTag(actionConfig, contactData);
        
        case 'remove_tag':
        case 'remove_contact_tag':
          return await executeRemoveTag(actionConfig, contactData);
        
        case 'assign_user':
          return await executeAssignUser(actionConfig, contactData);
        
        case 'remove_assigned_user':
          return await executeRemoveAssignedUser(actionConfig, contactData);
        
        case 'add_notes':
        case 'add_to_notes':
          return await executeAddNotes(actionConfig, contactData);
        
        case 'set_dnd':
        case 'set_contact_dnd':
          return await executeSetDND(actionConfig, contactData);

        // Sales & Opportunities Actions
        case 'create_opportunity':
          return await executeCreateOpportunity(actionConfig, contactData);
        
        case 'remove_opportunity':
          return await executeRemoveOpportunity(actionConfig, contactData);

        // Workflow Management Actions
        case 'add_to_workflow':
          return await executeAddToWorkflow(actionConfig, contactData);
        
        case 'remove_from_workflow':
          return await executeRemoveFromWorkflow(actionConfig, contactData);
        
        case 'remove_from_all_workflows':
          return await executeRemoveFromAllWorkflows(actionConfig, contactData);

        // Scheduling Actions
        case 'schedule_appointment':
          return await executeScheduleAppointment(actionConfig, contactData);
        
        case 'set_event_date':
          return await executeSetEventDate(actionConfig, contactData);

        // Task Management Actions
        case 'create_task':
          return await executeCreateTask(actionConfig, contactData);

        // Flow Control Actions
        case 'wait':
          return await executeWait(actionConfig, contactData);
        
        case 'condition':
          return await executeCondition(actionConfig, contactData);
        
        case 'end':
          return await executeEnd(actionConfig, contactData);

        default:
          console.warn(`Unknown action type: ${actionConfig.type}`);
          return {
            success: false,
            message: `Unknown action type: ${actionConfig.type}`
          };
      }
    } catch (error) {
      console.error(`Error executing action ${actionConfig.type}:`, error);
      return {
        success: false,
        message: `Failed to execute ${actionConfig.type}: ${error.message}`
      };
    }
  };

  // Communication Action Implementations
  const executeSendEmail = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const personalizedSubject = replaceVariables(settings.subject || '', contactData);
    const personalizedMessage = replaceVariables(settings.message || '', contactData);
    
    console.log('Sending email:', {
      to: contactData.email,
      subject: personalizedSubject,
      message: personalizedMessage,
      template: settings.templateId,
      from: settings.fromEmail
    });
    
    return {
      success: true,
      message: `Email sent to ${contactData.email}`,
      data: { emailId: `email_${Date.now()}` }
    };
  };

  const executeSendSMS = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const personalizedMessage = replaceVariables(settings.message || '', contactData);
    
    console.log('Sending SMS:', {
      to: contactData.phone,
      message: personalizedMessage,
      from: settings.fromNumber
    });
    
    return {
      success: true,
      message: `SMS sent to ${contactData.phone}`,
      data: { smsId: `sms_${Date.now()}` }
    };
  };

  const executeSendNotification = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Sending notification:', {
      message: settings.message,
      recipientType: settings.recipientType,
      recipients: settings.recipients
    });
    
    return {
      success: true,
      message: `Notification sent to ${settings.recipientType || 'team'}`,
      data: { notificationId: `notif_${Date.now()}` }
    };
  };

  const executeSendReviewRequest = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    console.log('Sending review request:', {
      platform: settings.platform,
      message: settings.message,
      contact: contactData.email
    });
    
    return {
      success: true,
      message: `Review request sent via ${settings.platform || 'default platform'}`,
      data: { requestId: `review_${Date.now()}` }
    };
  };

  // Contact Management Action Implementations
  const executeAddTag = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('Adding tag:', {
      contactId: contactData.id,
      tagName: settings.tagName,
      tagColor: settings.tagColor
    });
    
    return {
      success: true,
      message: `Tag "${settings.tagName}" added to contact`,
      data: { tagId: `tag_${Date.now()}` }
    };
  };

  const executeRemoveTag = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('Removing tag:', {
      contactId: contactData.id,
      tagName: settings.tagName
    });
    
    return {
      success: true,
      message: `Tag "${settings.tagName}" removed from contact`
    };
  };

  const executeAssignUser = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    console.log('Assigning user:', {
      contactId: contactData.id,
      userId: settings.userId,
      notifyUser: settings.notifyUser
    });
    
    return {
      success: true,
      message: `Contact assigned to user ${settings.userId}`,
      data: { assignmentId: `assign_${Date.now()}` }
    };
  };

  const executeRemoveAssignedUser = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    console.log('Removing assigned user:', {
      contactId: contactData.id,
      userId: settings.userId
    });
    
    return {
      success: true,
      message: `User assignment removed from contact`
    };
  };

  const executeAddNotes = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Adding notes:', {
      contactId: contactData.id,
      noteContent: settings.noteContent,
      noteType: settings.noteType
    });
    
    return {
      success: true,
      message: `Note added to contact record`,
      data: { noteId: `note_${Date.now()}` }
    };
  };

  const executeSetDND = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('Setting DND:', {
      contactId: contactData.id,
      dndType: settings.dndType,
      duration: settings.duration
    });
    
    return {
      success: true,
      message: `DND set for ${settings.dndType} communications`,
      data: { dndId: `dnd_${Date.now()}` }
    };
  };

  // Sales & Opportunities Action Implementations
  const executeCreateOpportunity = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Creating opportunity:', {
      contactId: contactData.id,
      title: settings.title,
      value: settings.value,
      stage: settings.stage,
      probability: settings.probability
    });
    
    return {
      success: true,
      message: `Opportunity "${settings.title}" created`,
      data: { opportunityId: `opp_${Date.now()}` }
    };
  };

  const executeRemoveOpportunity = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    console.log('Removing opportunity:', {
      contactId: contactData.id,
      opportunityId: settings.opportunityId,
      reason: settings.reason
    });
    
    return {
      success: true,
      message: `Opportunity removed from contact`
    };
  };

  // Workflow Management Action Implementations
  const executeAddToWorkflow = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 700));
    
    console.log('Adding to workflow:', {
      contactId: contactData.id,
      workflowId: settings.workflowId,
      startImmediately: settings.startImmediately
    });
    
    return {
      success: true,
      message: `Contact added to workflow ${settings.workflowId}`,
      data: { workflowEntryId: `entry_${Date.now()}` }
    };
  };

  const executeRemoveFromWorkflow = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Removing from workflow:', {
      contactId: contactData.id,
      workflowId: settings.workflowId
    });
    
    return {
      success: true,
      message: `Contact removed from workflow ${settings.workflowId}`
    };
  };

  const executeRemoveFromAllWorkflows = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Removing from all workflows:', {
      contactId: contactData.id,
      excludeCurrentWorkflow: settings.excludeCurrentWorkflow
    });
    
    return {
      success: true,
      message: `Contact removed from all workflows`
    };
  };

  // Scheduling Action Implementations
  const executeScheduleAppointment = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Scheduling appointment:', {
      contactId: contactData.id,
      appointmentType: settings.appointmentType,
      duration: settings.duration,
      dateTime: settings.dateTime,
      notes: settings.notes
    });
    
    return {
      success: true,
      message: `${settings.appointmentType} appointment scheduled`,
      data: { appointmentId: `appt_${Date.now()}` }
    };
  };

  const executeSetEventDate = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    console.log('Setting event date:', {
      contactId: contactData.id,
      eventType: settings.eventType,
      eventDate: settings.eventDate,
      reminder: settings.reminder
    });
    
    return {
      success: true,
      message: `${settings.eventType} date set for ${settings.eventDate}`,
      data: { eventId: `event_${Date.now()}` }
    };
  };

  // Task Management Action Implementations
  const executeCreateTask = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    console.log('Creating task:', {
      title: settings.title,
      description: settings.description,
      assignedTo: settings.assignedTo,
      priority: settings.priority,
      dueDate: settings.dueDate,
      contactId: contactData.id
    });
    
    return {
      success: true,
      message: `Task "${settings.title}" created`,
      data: { taskId: `task_${Date.now()}` }
    };
  };

  // Flow Control Action Implementations
  const executeWait = async (actionConfig: ActionConfig, contactData: any) => {
    const { delay } = actionConfig;
    
    if (!delay || delay.amount <= 0) {
      return {
        success: true,
        message: 'No delay specified, continuing immediately'
      };
    }
    
    const delayMs = convertDelayToMs(delay);
    console.log(`Waiting ${delay.amount} ${delay.unit} (${delayMs}ms)`);
    
    // In real implementation, this would schedule the next action
    // For demo purposes, we'll just simulate a short delay
    await new Promise(resolve => setTimeout(resolve, Math.min(delayMs, 2000)));
    
    return {
      success: true,
      message: `Waited ${delay.amount} ${delay.unit}`,
      data: { delayMs }
    };
  };

  const executeCondition = async (actionConfig: ActionConfig, contactData: any) => {
    const { settings } = actionConfig;
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const fieldValue = getContactFieldValue(contactData, settings.conditionField);
    const conditionResult = evaluateCondition(fieldValue, settings.operator, settings.value);
    
    console.log('Evaluating condition:', {
      field: settings.conditionField,
      operator: settings.operator,
      expectedValue: settings.value,
      actualValue: fieldValue,
      result: conditionResult
    });
    
    return {
      success: true,
      message: `Condition evaluated: ${conditionResult ? 'TRUE' : 'FALSE'}`,
      data: { conditionResult, fieldValue }
    };
  };

  const executeEnd = async (actionConfig: ActionConfig, contactData: any) => {
    console.log('Ending workflow execution for contact:', contactData.id);
    
    return {
      success: true,
      message: 'Workflow execution ended'
    };
  };

  // Helper Functions
  const replaceVariables = (text: string, contactData: any): string => {
    if (!text || typeof text !== 'string') return text;
    
    return text
      .replace(/\{\{first_name\}\}/g, contactData.firstName || '')
      .replace(/\{\{last_name\}\}/g, contactData.lastName || '')
      .replace(/\{\{email\}\}/g, contactData.email || '')
      .replace(/\{\{phone\}\}/g, contactData.phone || '')
      .replace(/\{\{company\}\}/g, contactData.company || '')
      .replace(/\{\{full_name\}\}/g, `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim());
  };

  const convertDelayToMs = (delay: { amount: number; unit: 'minutes' | 'hours' | 'days' }): number => {
    const { amount, unit } = delay;
    switch (unit) {
      case 'minutes':
        return amount * 60 * 1000;
      case 'hours':
        return amount * 60 * 60 * 1000;
      case 'days':
        return amount * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  };

  const getContactFieldValue = (contactData: any, fieldName: string): any => {
    switch (fieldName) {
      case 'email':
        return contactData.email;
      case 'phone':
        return contactData.phone;
      case 'tags':
        return contactData.tags || [];
      case 'source':
        return contactData.source;
      case 'status':
        return contactData.status;
      case 'company':
        return contactData.company;
      case 'city':
        return contactData.city;
      case 'state':
        return contactData.state;
      default:
        return contactData[fieldName];
    }
  };

  const evaluateCondition = (fieldValue: any, operator: string, expectedValue: any): boolean => {
    switch (operator) {
      case 'equals':
        return fieldValue === expectedValue;
      case 'not_equals':
        return fieldValue !== expectedValue;
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(expectedValue).toLowerCase());
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(expectedValue).toLowerCase());
      case 'exists':
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      case 'not_exists':
        return fieldValue === null || fieldValue === undefined || fieldValue === '';
      case 'greater_than':
        return Number(fieldValue) > Number(expectedValue);
      case 'less_than':
        return Number(fieldValue) < Number(expectedValue);
      default:
        return false;
    }
  };

  // Expose the executeAction function for use by the workflow engine
  (window as any).workflowExecuteAction = executeAction;

  return (
    <div className="hidden">
      {/* This component runs in the background */}
      <div id="workflow-execution-engine" data-initialized="true" />
    </div>
  );
}
