/* scripts.js - admin panel behavior (jQuery + Bootstrap) */
(function($){
  'use strict';

  const STORAGE_KEYS = {
    SIDEBAR_COLLAPSED: 'adminSidebarCollapsed',
    THEME: 'adminTheme',
  };

  $(document).ready(function(){
    // Initialize tooltips (bootstrap)
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Set up sidebar state from localStorage
    initSidebarState();

    // Sidebar collapse/expand (desktop)
    $('#sidebarCollapseBtn').on('click', function(){
      toggleSidebar();
    });

    // Topbar small-screen toggle opens offcanvas via bootstrap attribute - no extra code needed
    // But ensure mobile open button toggles offcanvas (already set in markup)

    // Theme toggle
    initTheme();
    $('#themeToggleBtn').on('click', function(){
      toggleTheme();
    });

    // Search behavior
    $('#topbarSearchBtn').on('click', function(){
      const q = $('#topbarSearchInput').val().trim();
      if(!q) {
        $('#topbarSearchInput').focus();
        return;
      }
      // Simple reusable function - you can wire to actual search later
      console.log('Search:', q);
      // Optionally show a toast or highlight — keep minimal for frontend-only
    });

    // Notification badge demo behavior (clear on open)
    $('#notifDropdownBtn').on('show.bs.dropdown', function(){
      $('#notifBadge').fadeOut(200);
    });

    // Add active class to sidebar link matching current path (best-effort)
    highlightActiveNav();

    // Auto-year for footer (in case footer script didn't run)
    try {
      document.getElementById('autoYear').textContent = new Date().getFullYear();
    } catch(e){}

    // Reusable helper: simple modal launch - example
    window.adminOpenModal = function(modalSelector){
      const modalEl = document.querySelector(modalSelector);
      if(!modalEl) return;
      new bootstrap.Modal(modalEl).show();
    };

    // Expose small utilities
    window.adminUtils = {
      setTheme: setTheme,
      getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME) || 'light'
    };
  });

  /* ---------- Sidebar related ---------- */

  function initSidebarState() {
    const collapsed = (localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true');
    const $sidebar = $('#adminSidebar');
    if(collapsed) {
      $sidebar.addClass('collapsed');
    } else {
      $sidebar.removeClass('collapsed');
    }

    // Clicking a nav link on mobile should close offcanvas
    $('#sidebarOffcanvas .nav-link').on('click', function(){
      var offcanvasEl = document.getElementById('sidebarOffcanvas');
      var bsOff = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if(bsOff) bsOff.hide();
    });

    // Also allow dragging/resizing behavior etc. (kept minimal)
  }

  function toggleSidebar() {
    const $sidebar = $('#adminSidebar');
    const isCollapsed = $sidebar.hasClass('collapsed');
    if(isCollapsed) {
      $sidebar.removeClass('collapsed');
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, 'false');
      // change icon
      $('#sidebarCollapseBtn i').removeClass('fa-angle-right').addClass('fa-angle-left');
    } else {
      $sidebar.addClass('collapsed');
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, 'true');
      $('#sidebarCollapseBtn i').removeClass('fa-angle-left').addClass('fa-angle-right');
    }
    // trigger window resize if any layout libs need it
    setTimeout(function(){ window.dispatchEvent(new Event('resize')); }, 260);
  }

  /* ---------- Theme (Light/Dark) ---------- */

  function initTheme(){
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    setTheme(saved);
    // Update icon
    updateThemeIcon(saved);
  }

  function setTheme(theme){
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      updateThemeIcon(theme);
    } catch(e){}
  }

  function toggleTheme(){
    const current = (localStorage.getItem(STORAGE_KEYS.THEME) === 'dark') ? 'dark' : 'light';
    const next = (current === 'dark') ? 'light' : 'dark';
    setTheme(next);
  }

  function updateThemeIcon(theme){
    const $icon = $('#themeToggleIcon');
    if(!$icon.length) return;
    if(theme === 'dark'){
      $icon.removeClass('fa-moon').addClass('fa-sun');
    } else {
      $icon.removeClass('fa-sun').addClass('fa-moon');
    }
    $('#themeToggleBtn').attr('aria-pressed', theme === 'dark');
    $('#themeToggleBtn').attr('title', theme === 'dark' ? 'Light mode' : 'Dark mode');
  }

  /* ---------- Utilities ---------- */

  function highlightActiveNav(){
    try {
      const path = window.location.pathname || '/';
      // match by data-route attribute for desktop links
      $('#sidebarNav .nav-link').each(function(){
        const route = $(this).attr('data-route') || $(this).attr('href') || '';
        if(route && path.indexOf(route) !== -1) {
          $('#sidebarNav .nav-link').removeClass('active');
          $(this).addClass('active');
        }
      });
      // mobile offcanvas nav
      $('#sidebarOffcanvas .nav-link').each(function(){
        const href = $(this).attr('href') || '';
        if(href && path.indexOf(href) !== -1) {
          $('#sidebarOffcanvas .nav-link').removeClass('active');
          $(this).addClass('active');
        }
      });
    } catch(e){}
  }

})(jQuery);
