
import { useWorkflowStore, WorkflowNode, WorkflowConnection, WorkflowExecution } from '@/store/useWorkflowStore';
import { toast } from 'sonner';

export class WorkflowExecutionEngine {
  private static instance: WorkflowExecutionEngine;
  
  public static getInstance(): WorkflowExecutionEngine {
    if (!WorkflowExecutionEngine.instance) {
      WorkflowExecutionEngine.instance = new WorkflowExecutionEngine();
    }
    return WorkflowExecutionEngine.instance;
  }

  async executeWorkflow(
    nodes: WorkflowNode[],
    connections: WorkflowConnection[],
    contactData: any,
    executionId: string
  ): Promise<{ success: boolean; logs: any[] }> {
    const logs: any[] = [];
    
    try {
      console.log('Starting workflow execution:', { executionId, contactData });
      
      // Find trigger node
      const triggerNode = nodes.find(node => node.type === 'trigger');
      if (!triggerNode) {
        throw new Error('No trigger node found in workflow');
      }

      logs.push({
        nodeId: triggerNode.id,
        action: 'trigger_activated',
        timestamp: new Date(),
        result: 'success',
        message: 'Workflow triggered successfully',
        data: { contactData }
      });

      // Execute workflow from trigger
      await this.executeFromNode(triggerNode, nodes, connections, contactData, logs);
      
      return { success: true, logs };
    } catch (error: any) {
      console.error('Workflow execution failed:', error);
      
      logs.push({
        nodeId: 'system',
        action: 'execution_error',
        timestamp: new Date(),
        result: 'failure',
        message: error.message,
        data: { error: error.stack }
      });
      
      return { success: false, logs };
    }
  }

  private async executeFromNode(
    node: WorkflowNode,
    nodes: WorkflowNode[],
    connections: WorkflowConnection[],
    contactData: any,
    logs: any[]
  ): Promise<void> {
    console.log(`Executing node: ${node.id} (${node.type})`);
    
    // Execute current node
    const result = await this.executeNode(node, contactData);
    
    logs.push({
      nodeId: node.id,
      action: node.type,
      timestamp: new Date(),
      result: result.success ? 'success' : 'failure',
      message: result.message,
      data: result.data || {}
    });

    if (!result.success) {
      throw new Error(`Node ${node.id} failed: ${result.message}`);
    }

    // Find next nodes
    const nextConnections = connections.filter(conn => conn.source === node.id);
    
    for (const connection of nextConnections) {
      const nextNode = nodes.find(n => n.id === connection.target);
      if (nextNode) {
        // Check connection conditions if any
        if (this.shouldFollowConnection(connection, result.data)) {
          await this.executeFromNode(nextNode, nodes, connections, contactData, logs);
        }
      }
    }
  }

  private async executeNode(node: WorkflowNode, contactData: any): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    
    switch (node.type) {
      case 'trigger':
        return this.executeTrigger(node, contactData);
      case 'action':
        return this.executeAction(node, contactData);
      case 'condition':
        return this.executeCondition(node, contactData);
      case 'wait':
        return this.executeWait(node);
      default:
        console.log(`Executing generic node: ${node.type}`);
        return { success: true, message: `Node ${node.type} executed successfully` };
    }
  }

  private async executeTrigger(node: WorkflowNode, contactData: any): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    
    console.log('Executing trigger:', config);
    
    // Simulate trigger validation
    if (config?.conditions) {
      const meetsConditions = this.evaluateConditions(config.conditions, contactData);
      if (!meetsConditions) {
        return { success: false, message: 'Contact does not meet trigger conditions' };
      }
    }
    
    return { success: true, message: 'Trigger activated successfully', data: contactData };
  }

  private async executeAction(node: WorkflowNode, contactData: any): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    
    if (!config?.type) {
      return { success: false, message: 'Action type not configured' };
    }

    console.log('Executing action:', config.type, config);
    
    switch (config.type) {
      case 'send_email':
        return this.sendEmail(config.settings, contactData);
      case 'send_sms':
        return this.sendSMS(config.settings, contactData);
      case 'send_notification':
        return this.sendNotification(config.settings, contactData);
      case 'add_tag':
        return this.addTag(config.settings, contactData);
      case 'remove_tag':
        return this.removeTag(config.settings, contactData);
      case 'assign_user':
        return this.assignUser(config.settings, contactData);
      case 'add_notes':
        return this.addNotes(config.settings, contactData);
      case 'set_dnd':
        return this.setDND(config.settings, contactData);
      case 'create_opportunity':
        return this.createOpportunity(config.settings, contactData);
      case 'remove_opportunity':
        return this.removeOpportunity(config.settings, contactData);
      case 'add_to_workflow':
        return this.addToWorkflow(config.settings, contactData);
      case 'remove_from_workflow':
        return this.removeFromWorkflow(config.settings, contactData);
      case 'remove_from_all_workflows':
        return this.removeFromAllWorkflows(config.settings, contactData);
      case 'schedule_appointment':
        return this.scheduleAppointment(config.settings, contactData);
      case 'set_event_date':
        return this.setEventDate(config.settings, contactData);
      case 'create_task':
        return this.createTask(config.settings, contactData);
      default:
        return { success: true, message: `Action ${config.type} executed successfully` };
    }
  }

  private async executeCondition(node: WorkflowNode, contactData: any): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    
    if (!config?.settings) {
      return { success: false, message: 'Condition not properly configured' };
    }

    const { conditionField, operator, value } = config.settings;
    const result = this.evaluateCondition(conditionField, operator, value, contactData);
    
    return { 
      success: true, 
      message: `Condition evaluated to ${result}`, 
      data: { conditionResult: result } 
    };
  }

  private async executeWait(node: WorkflowNode): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    const delay = config?.delay;
    
    if (delay && delay.amount > 0) {
      const milliseconds = this.convertToMilliseconds(delay.amount, delay.unit);
      console.log(`Waiting for ${delay.amount} ${delay.unit} (${milliseconds}ms)`);
      
      // In a real implementation, this would be handled by a job queue
      // For demo purposes, we'll simulate with a shorter delay
      const actualDelay = Math.min(milliseconds, 5000); // Max 5s for demo
      await new Promise(resolve => setTimeout(resolve, actualDelay));
    }
    
    return { success: true, message: `Wait completed (${delay?.amount || 0} ${delay?.unit || 'seconds'})` };
  }

  // Communication Actions
  private async sendEmail(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Sending email:', config);
    
    if (!config.subject || !config.message) {
      return { success: false, message: 'Email subject and message are required' };
    }

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const personalizedMessage = this.replacePlaceholders(config.message, contactData);
    const personalizedSubject = this.replacePlaceholders(config.subject, contactData);
    
    toast.success(`Email sent to ${contactData.email || 'contact'}: ${personalizedSubject}`);
    return { success: true, message: `Email sent successfully to ${contactData.email}` };
  }

  private async sendSMS(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Sending SMS:', config);
    
    if (!config.message) {
      return { success: false, message: 'SMS message is required' };
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const personalizedMessage = this.replacePlaceholders(config.message, contactData);
    
    toast.success(`SMS sent to ${contactData.phone || 'contact'}`);
    return { success: true, message: `SMS sent successfully to ${contactData.phone}` };
  }

  private async sendNotification(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Sending notification:', config);
    
    toast.info(`Internal notification: ${config.message}`);
    return { success: true, message: 'Internal notification sent successfully' };
  }

  // Contact Management Actions
  private async addTag(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Adding tag:', config.tagName);
    
    if (!config.tagName) {
      return { success: false, message: 'Tag name is required' };
    }
    
    toast.success(`Tag "${config.tagName}" added to ${contactData.firstName || 'contact'}`);
    return { success: true, message: `Tag "${config.tagName}" added successfully` };
  }

  private async removeTag(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Removing tag:', config.tagName);
    
    if (!config.tagName) {
      return { success: false, message: 'Tag name is required' };
    }
    
    toast.success(`Tag "${config.tagName}" removed from ${contactData.firstName || 'contact'}`);
    return { success: true, message: `Tag "${config.tagName}" removed successfully` };
  }

  private async assignUser(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Assigning user:', config);
    
    if (!config.userId) {
      return { success: false, message: 'User ID is required' };
    }
    
    toast.success(`Contact assigned to user ${config.userId}`);
    return { success: true, message: `Contact assigned successfully` };
  }

  private async addNotes(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Adding notes:', config);
    
    toast.success(`Notes added to ${contactData.firstName || 'contact'}`);
    return { success: true, message: 'Notes added successfully' };
  }

  private async setDND(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Setting DND:', config);
    
    toast.success(`DND status updated for ${contactData.firstName || 'contact'}`);
    return { success: true, message: 'DND status updated successfully' };
  }

  // Sales & Opportunities Actions
  private async createOpportunity(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Creating opportunity:', config);
    
    if (!config.title) {
      return { success: false, message: 'Opportunity title is required' };
    }
    
    toast.success(`Opportunity "${config.title}" created for ${contactData.firstName || 'contact'}`);
    return { success: true, message: `Opportunity "${config.title}" created successfully` };
  }

  private async removeOpportunity(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Removing opportunity:', config);
    
    toast.success(`Opportunity removed from ${contactData.firstName || 'contact'}`);
    return { success: true, message: 'Opportunity removed successfully' };
  }

  // Workflow Management Actions
  private async addToWorkflow(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Adding to workflow:', config);
    
    toast.success(`Contact added to workflow ${config.workflowId}`);
    return { success: true, message: 'Contact added to workflow successfully' };
  }

  private async removeFromWorkflow(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Removing from workflow:', config);
    
    toast.success(`Contact removed from workflow ${config.workflowId}`);
    return { success: true, message: 'Contact removed from workflow successfully' };
  }

  private async removeFromAllWorkflows(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Removing from all workflows:', config);
    
    toast.success(`Contact removed from all workflows`);
    return { success: true, message: 'Contact removed from all workflows successfully' };
  }

  // Scheduling Actions
  private async scheduleAppointment(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Scheduling appointment:', config);
    
    toast.success(`Appointment scheduled for ${contactData.firstName || 'contact'}`);
    return { success: true, message: 'Appointment scheduled successfully' };
  }

  private async setEventDate(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Setting event date:', config);
    
    toast.success(`Event date set for ${contactData.firstName || 'contact'}`);
    return { success: true, message: 'Event date set successfully' };
  }

  private async createTask(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Creating task:', config);
    
    if (!config.title) {
      return { success: false, message: 'Task title is required' };
    }
    
    toast.success(`Task "${config.title}" created`);
    return { success: true, message: `Task "${config.title}" created successfully` };
  }

  // Utility methods
  private shouldFollowConnection(connection: WorkflowConnection, nodeData: any): boolean {
    if (connection.type === 'condition' && nodeData?.conditionResult !== undefined) {
      // For condition connections, check if the result matches the expected path
      return connection.sourceHandle === (nodeData.conditionResult ? 'true' : 'false');
    }
    
    return true; // Default to following the connection
  }

  private evaluateConditions(conditions: any, contactData: any): boolean {
    if (!conditions) return true;
    
    // Simple condition evaluation - can be enhanced for complex logic
    for (const [field, expectedValue] of Object.entries(conditions)) {
      const actualValue = contactData[field];
      if (actualValue !== expectedValue) {
        return false;
      }
    }
    
    return true;
  }

  private evaluateCondition(field: string, operator: string, value: any, contactData: any): boolean {
    const fieldValue = contactData[field];
    
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(value);
      case 'not_contains':
        return typeof fieldValue === 'string' && !fieldValue.includes(value);
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null || fieldValue === '';
      default:
        return true;
    }
  }

  private replacePlaceholders(text: string, contactData: any): string {
    if (!text) return '';
    
    return text.replace(/\{\{(\w+)\}\}/g, (match, field) => {
      return contactData[field] || match;
    });
  }

  private convertToMilliseconds(amount: number, unit: string): number {
    switch (unit) {
      case 'minutes':
        return amount * 60 * 1000;
      case 'hours':
        return amount * 60 * 60 * 1000;
      case 'days':
        return amount * 24 * 60 * 60 * 1000;
      default:
        return amount * 1000;
    }
  }
}

export const workflowEngine = WorkflowExecutionEngine.getInstance();
