
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
      // Find trigger node
      const triggerNode = nodes.find(node => node.type === 'trigger');
      if (!triggerNode) {
        throw new Error('No trigger node found');
      }

      logs.push({
        nodeId: triggerNode.id,
        action: 'trigger_activated',
        timestamp: new Date(),
        result: 'success',
        message: 'Workflow triggered successfully'
      });

      // Execute workflow from trigger
      await this.executeFromNode(triggerNode, nodes, connections, contactData, logs);
      
      return { success: true, logs };
    } catch (error: any) {
      logs.push({
        nodeId: 'system',
        action: 'execution_error',
        timestamp: new Date(),
        result: 'failure',
        message: error.message
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
      message: result.message
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
        return { success: true, message: 'Node executed' };
    }
  }

  private async executeTrigger(node: WorkflowNode, contactData: any): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    
    // Simulate trigger validation
    if (config?.conditions) {
      // Check if contact meets trigger conditions
      const meetsConditions = this.evaluateConditions(config.conditions, contactData);
      if (!meetsConditions) {
        return { success: false, message: 'Contact does not meet trigger conditions' };
      }
    }
    
    return { success: true, message: 'Trigger activated', data: contactData };
  }

  private async executeAction(node: WorkflowNode, contactData: any): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    
    switch (config?.type) {
      case 'send_email':
        return this.sendEmail(config, contactData);
      case 'send_sms':
        return this.sendSMS(config, contactData);
      case 'add_tag':
        return this.addTag(config, contactData);
      case 'create_task':
        return this.createTask(config, contactData);
      default:
        return { success: true, message: `Action ${config?.type} executed` };
    }
  }

  private async executeCondition(node: WorkflowNode, contactData: any): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    
    const result = this.evaluateConditions(config, contactData);
    return { 
      success: true, 
      message: `Condition evaluated to ${result}`, 
      data: { conditionResult: result } 
    };
  }

  private async executeWait(node: WorkflowNode): Promise<{ success: boolean; message: string; data?: any }> {
    const config = node.data.config as any;
    const delay = config?.delay;
    
    if (delay) {
      const milliseconds = this.convertToMilliseconds(delay.amount, delay.unit);
      console.log(`Waiting for ${delay.amount} ${delay.unit}`);
      // In a real implementation, this would be handled by a job queue
      await new Promise(resolve => setTimeout(resolve, Math.min(milliseconds, 5000))); // Max 5s for demo
    }
    
    return { success: true, message: 'Wait completed' };
  }

  private shouldFollowConnection(connection: WorkflowConnection, nodeData: any): boolean {
    if (connection.type === 'condition' && nodeData?.conditionResult !== undefined) {
      // For condition connections, check if the result matches
      return connection.sourceHandle === (nodeData.conditionResult ? 'true' : 'false');
    }
    
    return true; // Default to following the connection
  }

  private evaluateConditions(conditions: any, contactData: any): boolean {
    if (!conditions) return true;
    
    // Simple condition evaluation - can be enhanced
    for (const [field, expectedValue] of Object.entries(conditions)) {
      const actualValue = contactData[field];
      if (actualValue !== expectedValue) {
        return false;
      }
    }
    
    return true;
  }

  private async sendEmail(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Sending email:', config);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Replace placeholders in message
    const message = this.replacePlaceholders(config.message || '', contactData);
    
    toast.success(`Email sent to ${contactData.email || 'contact'}: ${config.subject}`);
    return { success: true, message: 'Email sent successfully' };
  }

  private async sendSMS(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Sending SMS:', config);
    
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const message = this.replacePlaceholders(config.message || '', contactData);
    
    toast.success(`SMS sent to ${contactData.phone || 'contact'}`);
    return { success: true, message: 'SMS sent successfully' };
  }

  private async addTag(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Adding tag:', config.tagName);
    
    toast.success(`Tag "${config.tagName}" added to contact`);
    return { success: true, message: `Tag "${config.tagName}" added` };
  }

  private async createTask(config: any, contactData: any): Promise<{ success: boolean; message: string }> {
    console.log('Creating task:', config);
    
    toast.success(`Task "${config.title}" created`);
    return { success: true, message: 'Task created successfully' };
  }

  private replacePlaceholders(text: string, contactData: any): string {
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
