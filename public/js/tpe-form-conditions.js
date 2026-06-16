/**
 * Exibição condicional de campos (TPE Forms).
 */
(function () {
  'use strict'

  function getFieldName(fieldId) {
    return 'field_' + fieldId
  }

  function getTriggerElements(form, fieldId) {
    const base = getFieldName(fieldId)
    const el = form.elements[base] || form.elements[base + '[]']
    if (!el) return []
    if (el.tagName) return [el]
    if (el.length) return Array.prototype.slice.call(el)
    return [el]
  }

  function readTriggerValue(form, fieldId) {
    const els = getTriggerElements(form, fieldId)
    if (!els.length) return ''
    const first = els[0]
    if (first.type === 'checkbox') {
      return els.filter((x) => x.checked).map((x) => x.value)
    }
    if (first.type === 'radio') {
      const chk = els.filter((x) => x.checked)
      return chk.length ? chk[0].value : ''
    }
    return first.value != null ? String(first.value) : ''
  }

  function filledRaw(raw) {
    if (Array.isArray(raw)) return raw.length > 0
    return String(raw || '').trim() !== ''
  }

  function matches(triggerType, raw, operator, expected) {
    const f = filledRaw(raw)
    const exp = String(expected || '')
    switch (operator) {
      case 'filled':
        return f
      case 'empty':
        return !f
      case 'equals':
        if (Array.isArray(raw)) {
          return raw.length === 1 && String(raw[0]).trim() === exp.trim()
        }
        return String(raw || '').trim().toLowerCase() === exp.trim().toLowerCase()
      case 'not_equals':
        if (Array.isArray(raw)) {
          return !(raw.length === 1 && String(raw[0]).trim() === exp.trim())
        }
        return String(raw || '').trim().toLowerCase() !== exp.trim().toLowerCase()
      default:
        return true
    }
  }

  function applyShell(form, shell) {
    const rawAttr = shell.getAttribute('data-tpe-conditional')
    if (!rawAttr) return
    let cond
    try {
      cond = JSON.parse(rawAttr)
    } catch {
      return
    }
    const fid = cond.field_id
    const op = cond.operator || 'filled'
    const val = cond.value || ''
    const trigType = shell.getAttribute('data-tpe-trigger-type') || 'text'
    const rawVal = readTriggerValue(form, fid)
    const ok = matches(trigType, rawVal, op, val)

    if (ok) {
      shell.style.display = ''
      shell.setAttribute('aria-hidden', 'false')
      shell.querySelectorAll('[data-tpe-if-required="1"]').forEach((inp) => {
        inp.setAttribute('required', 'required')
      })
    } else {
      shell.style.display = 'none'
      shell.setAttribute('aria-hidden', 'true')
      shell.querySelectorAll('[data-tpe-if-required="1"]').forEach((inp) => {
        inp.removeAttribute('required')
      })
    }
  }

  function bindForm(form) {
    const shells = form.querySelectorAll('.tpe-field-shell[data-tpe-conditional]')
    if (!shells.length) return

    function refreshAll() {
      shells.forEach((sh) => applyShell(form, sh))
    }

    shells.forEach((shell) => {
      const raw = shell.getAttribute('data-tpe-conditional')
      if (!raw) return
      let cond
      try {
        cond = JSON.parse(raw)
      } catch {
        return
      }
      const fid = cond.field_id
      getTriggerElements(form, fid).forEach((el) => {
        el.addEventListener('change', refreshAll)
        el.addEventListener('input', refreshAll)
      })
    })

    refreshAll()
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tpe-main-form').forEach(bindForm)
  })
})()
