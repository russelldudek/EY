(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  const scenarios = {
    baseline: {
      label: 'Illustrative baseline: controlled industrial pilot',
      state: 'baseline', status: 'Bounded pilot',
      disposition: 'Proceed with bounded pilot',
      next: 'Confirm owner, safety authority, instrumentation and acceptance evidence.',
      levels: [.86,.82,.78,.83,.76,.68], risks:[0,0,0,0,0,1],
      notes: ['Defined mission','Covered environment','Instrumented perception','Explicit authority','Observable release','Ownership to prove']
    },
    drift: {
      label: 'Scenario: sensor drift during repeated operation',
      state: 'drift', status: 'Instrument',
      disposition: 'Pause expansion; instrument drift',
      next: 'Expose confidence decay, diagnostic evidence and fallback behavior before broader use.',
      levels: [.86,.78,.38,.74,.61,.55], risks:[0,0,2,1,1,1],
      notes: ['Mission intact','Coverage partial','Drift unbounded','Fallback needs proof','Release observable','Learning incomplete']
    },
    novel: {
      label: 'Scenario: novel obstacle outside the twin',
      state: 'novel', status: 'Rehearse',
      disposition: 'Return to simulation and controlled rehearsal',
      next: 'Expand scenario coverage and define behavior at the edge of environmental knowledge.',
      levels: [.83,.34,.51,.72,.66,.58], risks:[0,2,1,1,1,1],
      notes: ['Mission intact','Twin gap','Uncertainty elevated','Human boundary active','Release bounded','Capture new case']
    },
    authority: {
      label: 'Scenario: operator override conflicts with autonomy',
      state: 'authority', status: 'Bound',
      disposition: 'Clarify authority before additional autonomy',
      next: 'Define who can stop, override, resume and accept residual risk in the live workflow.',
      levels: [.82,.76,.70,.29,.60,.56], risks:[0,0,1,2,1,1],
      notes: ['Mission intact','Environment known','Perception adequate','Authority conflict','Runbook incomplete','Learning owner unclear']
    },
    regression: {
      label: 'Scenario: software release changes physical behavior',
      state: 'regression', status: 'Hold',
      disposition: 'Hold release and restore known-good behavior',
      next: 'Trace model, code, configuration and environment deltas; rehearse rollback and recovery.',
      levels: [.84,.75,.64,.62,.24,.47], risks:[0,0,1,1,2,2],
      notes: ['Mission intact','Twin stale','Evidence changed','Fallback uncertain','Regression failure','Learning not harvested']
    }
  };

  const stack = document.querySelector('.reality-stack');
  const board = document.querySelector('.case-board');
  const buttons = [...document.querySelectorAll('.scenario-button')];
  const reset = document.querySelector('.reset-button');
  function applyScenario(key) {
    const s = scenarios[key] || scenarios.baseline;
    if (stack) stack.dataset.state = s.state;
    document.querySelectorAll('[data-scenario-label]').forEach(el => el.textContent = s.label);
    document.querySelectorAll('[data-case-status]').forEach(el => el.textContent = s.status);
    document.querySelectorAll('[data-disposition]').forEach(el => el.textContent = s.disposition);
    document.querySelectorAll('[data-next]').forEach(el => el.textContent = s.next);
    document.querySelectorAll('.evidence-row').forEach((row, i) => {
      row.style.setProperty('--level', s.levels[i]);
      row.dataset.risk = s.risks[i];
      const out = row.querySelector('output'); if(out) out.textContent = s.notes[i];
    });
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scenario === key)));
    if (board) board.setAttribute('aria-label', `Reality Transfer Case. ${s.label}. Decision: ${s.disposition}.`);
  }
  buttons.forEach(b => b.addEventListener('click', () => applyScenario(b.dataset.scenario)));
  if (reset) reset.addEventListener('click', () => applyScenario('baseline'));
  applyScenario('baseline');
})();
