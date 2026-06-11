// ── Types & Interfaces (JSDoc for reference) ──────────────────────
// These types are documented via JSDoc comments for IDE support.

/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} location
 * @property {string[]} stacks
 * @property {Object<string, string>} stackColors
 * @property {string} coverLetter
 * @property {'nuevo' | 'en_revision' | 'entrevistado' | 'rechazado'} status
 * @property {boolean} isInvited
 * @property {string[]} notes
 */

/**
 * @typedef {Object} ProjectStats
 * @property {number} totalPostulados
 * @property {number} nuevosHoy
 * @property {number} enRevision
 * @property {number} entrevistados
 */

/**
 * @typedef {Object} ScheduleSlot
 * @property {string} date - ISO date string
 * @property {string} time - HH:mm format
 * @property {string} [message]
 */

/**
 * @typedef {Object} SidebarItem
 * @property {string} icon
 * @property {string} label
 * @property {string} path
 * @property {number} [badge]
 * @property {boolean} [active]
 */

/**
 * @typedef {'csv' | 'pdf'} ExportFormat
 * @typedef {'name' | 'status' | 'date'} SortField
 * @typedef {'asc' | 'desc'} SortDirection
 */
