// backend/services/StatusManager.js

/**
 * Manages book status types and transitions
 * Follows OCP: new statuses can be added to configuration without code changes
 */
class StatusManager {
  
  constructor() {
    // Extensible configuration - add new statuses here
    this.statuses = {
      'currently-reading': {
        label: 'Currently Reading',
        allowedTransitions: ['completed', 'paused']
      },
      'completed': {
        label: 'Completed',
        allowedTransitions: ['re-reading']
      },
      're-reading': {
        label: 'Re-reading',
        allowedTransitions: ['currently-reading', 'completed']
      },
      // Future statuses can be added here without modifying code:
      // 'paused': {
      //   label: 'Paused',
      //   allowedTransitions: ['currently-reading', 'completed', 'abandoned']
      // },
      // 'abandoned': {
      //   label: 'Abandoned',
      //   allowedTransitions: ['currently-reading']
      // }
    };
  }
  
  /**
   * Get list of all valid status keys
   * @returns {Array<string>}
   */
  getValidStatuses() {
    return Object.keys(this.statuses);
  }

  /**
   * Validate if a status is valid
   * @param {string} status 
   * @throws {Error} If status is invalid
   * @returns {boolean} true if valid
   */
  validateStatus(status) {
    if (!this.statuses[status]) {
      const validStatuses = this.getValidStatuses().join(', ');
      throw new Error(`Invalid status. Valid statuses: ${validStatuses}`);
    }
    return true;
  }
  
  /**
   * Get human-readable label for a status
   * @param {string} status 
   * @returns {string} Label or original status
   */
  getStatusLabel(status) {
    return this.statuses[status]?.label || status;
  }
  
  /**
   * Check if transition from one status to another is allowed
   * @param {string} fromStatus 
   * @param {string} toStatus 
   * @returns {boolean} true if transition is allowed
   */
  canTransition(fromStatus, toStatus) {
    const allowed = this.statuses[fromStatus]?.allowedTransitions || [];
    return allowed.includes(toStatus);
  }
  
  /**
   * Extension point: Add new status dynamically without modifying code
   * @param {string} statusKey - Status identifier (e.g., 'paused')
   * @param {Object} config - Configuration object
   * @param {string} config.label - Display label
   * @param {Array<string>} config.allowedTransitions - Array of allowed next statuses
   */
  registerStatus(statusKey, config) {
    this.statuses[statusKey] = config;
  }
  
}

module.exports = new StatusManager();
module.exports.StatusManager = StatusManager; // for tests/DI