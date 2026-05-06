import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sun, Plus, Trash2, Save, FileText, Search, ChevronRight, ChevronLeft, Home, Zap, Settings, CheckCircle, X, Edit, Calculator, Loader2, MapPin, Sparkles, Target, Gauge, Compass, BarChart3, Leaf, Phone, Mail, User, Award, Flame, LogOut, Users, Shield, Download, Eye, EyeOff, UserPlus, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';

const SUPABASE_URL = 'https://yxfanlgklvpdpsrzcoqy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SA4vTbf1FfOH2YNHtw3LJg_geqlOxpV';

const REGIONS = {
  'Nord / Hauts-de-France': 950,
  'Île-de-France': 1050,
  'Grand Est': 1050,
  'Normandie': 1000,
  'Bretagne': 1050,
  'Pays de la Loire': 1100,
  'Centre-Val de Loire': 1100,
  'Bourgogne-Franche-Comté': 1100,
  'Nouvelle-Aquitaine': 1250,
  'Auvergne-Rhône-Alpes': 1250,
  'Occitanie': 1350,
  "Provence-Alpes-Côte d'Azur": 1400,
  'Corse': 1450,
};

const DEPT_TO_REGION = {
  '02':'Nord / Hauts-de-France','59':'Nord / Hauts-de-France','60':'Nord / Hauts-de-France','62':'Nord / Hauts-de-France','80':'Nord / Hauts-de-France',
  '75':'Île-de-France','77':'Île-de-France','78':'Île-de-France','91':'Île-de-France','92':'Île-de-France','93':'Île-de-France','94':'Île-de-France','95':'Île-de-France',
  '08':'Grand Est','10':'Grand Est','51':'Grand Est','52':'Grand Est','54':'Grand Est','55':'Grand Est','57':'Grand Est','67':'Grand Est','68':'Grand Est','88':'Grand Est',
  '14':'Normandie','27':'Normandie','50':'Normandie','61':'Normandie','76':'Normandie',
  '22':'Bretagne','29':'Bretagne','35':'Bretagne','56':'Bretagne',
  '44':'Pays de la Loire','49':'Pays de la Loire','53':'Pays de la Loire','72':'Pays de la Loire','85':'Pays de la Loire',
  '18':'Centre-Val de Loire','28':'Centre-Val de Loire','36':'Centre-Val de Loire','37':'Centre-Val de Loire','41':'Centre-Val de Loire','45':'Centre-Val de Loire',
  '21':'Bourgogne-Franche-Comté','25':'Bourgogne-Franche-Comté','39':'Bourgogne-Franche-Comté','58':'Bourgogne-Franche-Comté','70':'Bourgogne-Franche-Comté','71':'Bourgogne-Franche-Comté','89':'Bourgogne-Franche-Comté','90':'Bourgogne-Franche-Comté',
  '16':'Nouvelle-Aquitaine','17':'Nouvelle-Aquitaine','19':'Nouvelle-Aquitaine','23':'Nouvelle-Aquitaine','24':'Nouvelle-Aquitaine','33':'Nouvelle-Aquitaine','40':'Nouvelle-Aquitaine','47':'Nouvelle-Aquitaine','64':'Nouvelle-Aquitaine','79':'Nouvelle-Aquitaine','86':'Nouvelle-Aquitaine','87':'Nouvelle-Aquitaine',
  '01':'Auvergne-Rhône-Alpes','03':'Auvergne-Rhône-Alpes','07':'Auvergne-Rhône-Alpes','15':'Auvergne-Rhône-Alpes','26':'Auvergne-Rhône-Alpes','38':'Auvergne-Rhône-Alpes','42':'Auvergne-Rhône-Alpes','43':'Auvergne-Rhône-Alpes','63':'Auvergne-Rhône-Alpes','69':'Auvergne-Rhône-Alpes','73':'Auvergne-Rhône-Alpes','74':'Auvergne-Rhône-Alpes',
  '09':'Occitanie','11':'Occitanie','12':'Occitanie','30':'Occitanie','31':'Occitanie','32':'Occitanie','34':'Occitanie','46':'Occitanie','48':'Occitanie','65':'Occitanie','66':'Occitanie','81':'Occitanie','82':'Occitanie',
  '04':"Provence-Alpes-Côte d'Azur",'05':"Provence-Alpes-Côte d'Azur",'06':"Provence-Alpes-Côte d'Azur",'13':"Provence-Alpes-Côte d'Azur",'83':"Provence-Alpes-Côte d'Azur",'84':"Provence-Alpes-Côte d'Azur",
  '2A':'Corse','2B':'Corse',
};

const ORIENTATION_COEF = { 'Sud': 1.0, 'Sud-Est': 0.95, 'Sud-Ouest': 0.95, 'Est': 0.85, 'Ouest': 0.85, 'Nord': 0.6 };

const KWC_TIERS = [3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

const APPLIANCE_CATEGORIES = [
  { id: 'cuisine', label: 'Cuisine', emoji: '🍳', items: [
    { name: 'Réfrigérateur', kwh_year: 350, emoji: '🧊' },
    { name: 'Congélateur', kwh_year: 300, emoji: '❄️' },
    { name: 'Lave-vaisselle', kwh_year: 250, emoji: '🍽️' },
    { name: 'Four électrique', kwh_year: 150, emoji: '🔥' },
    { name: 'Plaques cuisson', kwh_year: 200, emoji: '🍳' },
    { name: 'Micro-ondes', kwh_year: 50, emoji: '📡' },
    { name: 'Cafetière', kwh_year: 80, emoji: '☕' },
    { name: 'Bouilloire', kwh_year: 60, emoji: '🫖' },
  ]},
  { id: 'lavage', label: 'Buanderie', emoji: '🧺', items: [
    { name: 'Lave-linge', kwh_year: 200, emoji: '👕' },
    { name: 'Sèche-linge', kwh_year: 350, emoji: '🌀' },
    { name: 'Fer à repasser', kwh_year: 60, emoji: '👔' },
  ]},
  { id: 'multimedia', label: 'Multimédia', emoji: '📺', items: [
    { name: 'Télévision', kwh_year: 270, emoji: '📺' },
    { name: 'Box internet', kwh_year: 175, emoji: '📡' },
    { name: 'Ordinateur', kwh_year: 290, emoji: '💻' },
    { name: 'Console de jeu', kwh_year: 150, emoji: '🎮' },
    { name: 'Home cinéma', kwh_year: 330, emoji: '🎬' },
  ]},
  { id: 'chauffage', label: 'Chauffage / Clim', emoji: '🔥', items: [
    { name: 'Chauffage électrique', kwh_year: 5000, emoji: '🔥' },
    { name: 'Pompe à chaleur', kwh_year: 4500, emoji: '🌬️' },
    { name: 'Climatisation', kwh_year: 1500, emoji: '❄️' },
    { name: "Radiateur d'appoint", kwh_year: 800, emoji: '🌡️' },
  ]},
  { id: 'eau', label: 'Eau chaude', emoji: '💧', items: [
    { name: 'Ballon eau chaude', kwh_year: 2500, emoji: '🚿' },
    { name: 'Ballon thermodynamique', kwh_year: 1200, emoji: '♨️' },
  ]},
  { id: 'mobilite', label: 'Mobilité', emoji: '🚗', items: [
    { name: 'Voiture électrique', kwh_year: 3000, emoji: '🚗' },
    { name: 'Borne recharge VE', kwh_year: 3500, emoji: '🔌' },
    { name: 'Vélo électrique', kwh_year: 50, emoji: '🚲' },
  ]},
  { id: 'piscine', label: 'Piscine / Spa', emoji: '🏊', items: [
    { name: 'Pompe filtration', kwh_year: 2200, emoji: '💦' },
    { name: 'Piscine chauffée', kwh_year: 4500, emoji: '🏊' },
    { name: 'Spa / Jacuzzi', kwh_year: 2500, emoji: '🛁' },
  ]},
  { id: 'autre', label: 'Autres', emoji: '✨', items: [
    { name: 'Éclairage LED', kwh_year: 180, emoji: '💡' },
    { name: 'Aspirateur', kwh_year: 50, emoji: '🧹' },
    { name: 'Sèche-cheveux', kwh_year: 30, emoji: '💇' },
  ]},
];

const PANEL_OPTIONS = [375, 400, 425, 450, 475, 500];

const STEPS = [
  { id: 1, label: 'Client', icon: User },
  { id: 2, label: 'Logement', icon: Home },
  { id: 3, label: 'Équipements', icon: Zap },
  { id: 4, label: 'Conso', icon: BarChart3 },
  { id: 5, label: 'Solution', icon: Settings },
  { id: 6, label: 'Récap', icon: Award },
];

const initialSim = {
  client_name: '', client_phone: '', client_email: '',
  client_address: '', client_postal_code: '', client_city: '',
  housing_type: 'Maison', surface_m2: '', occupants: '',
  region: 'Île-de-France',
  heating_type: 'Électrique', hot_water_type: 'Ballon électrique',
  roof_orientation: 'Sud', roof_inclination: 30,
  annual_consumption_kwh: '',
  appliances: [],
  panel_power_w: 425,
  final_kwc: null, final_panels: null,
  notes: '', status: 'brouillon',
};

// ============ HELPERS API ============

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Retry with exponential backoff on network errors and 5xx.
// Auth errors (401/403) and bad-request (4xx) are NOT retried.
async function apiCall(path, options = {}) {
  const session = JSON.parse(localStorage.getItem('solar_session') || 'null');
  const token = session?.access_token || SUPABASE_KEY;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const maxAttempts = options.noRetry ? 1 : 3;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers });
      // Retry only on transient server errors
      if (res.status >= 500 && res.status < 600 && attempt < maxAttempts) {
        await sleep(300 * Math.pow(2, attempt - 1));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        await sleep(300 * Math.pow(2, attempt - 1)); // 300ms, 600ms, 1200ms
        continue;
      }
      throw err;
    }
  }
  throw lastErr || new Error('Network error');
}

// ============ MAIN APP ============

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('solar_session');
    const storedProfile = localStorage.getItem('solar_profile');
    if (stored && storedProfile) {
      setSession(JSON.parse(stored));
      setProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  const handleLogin = (sess, prof) => {
    localStorage.setItem('solar_session', JSON.stringify(sess));
    localStorage.setItem('solar_profile', JSON.stringify(prof));
    setSession(sess);
    setProfile(prof);
  };

  const handleLogout = () => {
    localStorage.removeItem('solar_session');
    localStorage.removeItem('solar_profile');
    setSession(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
      </div>
    );
  }

  if (!session || !profile) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <MainApp session={session} profile={profile} onLogout={handleLogout} />;
}

// ============ LOGIN ============

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e?.preventDefault?.();
    setError('');
    setLoading(true);
    try {
      const cleanUsername = username.trim().toLowerCase();
      if (!cleanUsername) {
        setError('Veuillez saisir votre identifiant');
        setLoading(false);
        return;
      }
      const email = `${cleanUsername}@solarsim.app`;

      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Identifiant ou mot de passe incorrect');

      const profRes = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${data.user.id}&select=*`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${data.access_token}` },
      });
      const profData = await profRes.json();
      const profile = profData[0];

      if (!profile) throw new Error('Profil introuvable. Contactez votre gestionnaire.');
      if (!profile.active) throw new Error('Compte désactivé. Contactez votre gestionnaire.');

      onLogin(data, profile);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-xl bg-slate-900 items-center justify-center mb-4">
            <Sun className="w-7 h-7 text-amber-400" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SOLAR SIM</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Études photovoltaïques</p>
        </div>

        <div className="bg-white rounded-lg p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Connexion</h2>
          <p className="text-sm text-slate-500 mb-6">Accédez à votre espace de travail</p>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Identifiant">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Votre prénom"
                  required
                  autoComplete="username"
                  autoCapitalize="off"
                  className="pl-9"
                />
              </div>
            </Field>

            <Field label="Mot de passe">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {error && (
              <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-md font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-sm shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Se connecter
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Pas encore de compte ?<br />
              Contactez votre gestionnaire pour qu'il vous crée un accès.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Outil professionnel d'étude photovoltaïque
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============

function MainApp({ session, profile, onLogout }) {
  const [view, setView] = useState('list');
  const [adminView, setAdminView] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentSim, setCurrentSim] = useState(initialSim);
  const [step, setStep] = useState(1);
  const [stepsAttempted, setStepsAttempted] = useState({}); // { [stepId]: true } -> show errors for that step
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCommercial, setFilterCommercial] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('updated_desc'); // updated_desc | name_asc | kwc_desc | status
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [overrideMode, setOverrideMode] = useState(false);
  // Autosave state
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState('idle'); // 'idle' | 'pending' | 'saving' | 'saved' | 'error'

  // Live errors for the current step (always computed, only shown if step has been attempted)
  const currentStepErrors = useMemo(() => validateStep(step, currentSim), [step, currentSim]);
  const showErrors = !!stepsAttempted[step];
  const visibleErrors = showErrors ? currentStepErrors : {};

  const tryGoToStep = (target) => {
    // Going backward: always allow, no validation
    if (target < step) { setStep(target); return; }
    // Going forward: validate current step
    const errs = validateStep(step, currentSim);
    if (Object.keys(errs).length > 0) {
      setStepsAttempted(prev => ({ ...prev, [step]: true }));
      const firstError = Object.values(errs)[0];
      showToast(firstError, 'error');
      return;
    }
    setStep(target);
  };

  const isManager = profile.role === 'gestionnaire';

  useEffect(() => {
    loadSimulations();
    if (isManager) loadUsers();
  }, []);

  const toastTimerRef = useRef(null);
  const showToast = (msg, type = 'success', opts = {}) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ msg, type, action: opts.action || null });
    const duration = opts.duration || 2500;
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      if (opts.onTimeout) opts.onTimeout();
    }, duration);
  };
  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  const loadSimulations = async () => {
    setLoading(true);
    try {
      const res = await apiCall(`/rest/v1/solar_simulations?select=*&order=updated_at.desc`);
      const data = await res.json();
      setSimulations(Array.isArray(data) ? data : []);
    } catch (e) { showToast('Erreur de chargement', 'error'); }
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const res = await apiCall(`/rest/v1/user_profiles?select=*&order=created_at.desc`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const saveSimulation = async (opts = {}) => {
    const silent = !!opts.silent;
    if (!currentSim.client_name?.trim()) {
      if (!silent) {
        showToast('Le nom du client est requis', 'error');
        setStep(1);
      }
      return;
    }
    if (silent) setAutosaveStatus('saving'); else setSaving(true);
    try {
      const calcs = computeAll(currentSim);
      const payload = {
        client_name: currentSim.client_name,
        client_phone: currentSim.client_phone || null,
        client_email: currentSim.client_email || null,
        client_address: currentSim.client_address || null,
        client_postal_code: currentSim.client_postal_code || null,
        client_city: currentSim.client_city || null,
        housing_type: currentSim.housing_type,
        surface_m2: numOrNull(currentSim.surface_m2),
        occupants: intOrNull(currentSim.occupants),
        region: currentSim.region,
        heating_type: currentSim.heating_type,
        hot_water_type: currentSim.hot_water_type,
        roof_orientation: currentSim.roof_orientation,
        roof_inclination: currentSim.roof_inclination,
        annual_consumption_kwh: numOrNull(currentSim.annual_consumption_kwh),
        estimated_consumption_kwh: calcs.estimatedConsumption,
        appliances: currentSim.appliances || [],
        recommended_kwc: calcs.recommendedKwc,
        recommended_panels: calcs.recommendedPanels,
        panel_power_w: currentSim.panel_power_w,
        final_kwc: currentSim.final_kwc ?? calcs.recommendedKwc,
        final_panels: currentSim.final_panels ?? calcs.recommendedPanels,
        estimated_annual_production_kwh: calcs.production,
        self_consumption_rate: calcs.selfConsumptionRate,
        notes: currentSim.notes || null,
        status: currentSim.status,
        created_by: profile.id,
        created_by_name: profile.full_name,
      };
      const isUpdate = !!currentSim.id;
      const url = isUpdate
        ? `/rest/v1/solar_simulations?id=eq.${currentSim.id}`
        : `/rest/v1/solar_simulations`;
      const res = await apiCall(url, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const saved = Array.isArray(data) ? data[0] : data;
      setCurrentSim({ ...saved, appliances: saved.appliances || [] });
      setIsDirty(false);
      setLastSavedAt(Date.now());
      if (silent) setAutosaveStatus('saved');
      else showToast(isUpdate ? 'Étude mise à jour' : 'Étude enregistrée');
      await loadSimulations();
    } catch (e) {
      console.error(e);
      if (silent) setAutosaveStatus('error');
      else showToast("Erreur d'enregistrement", 'error');
    }
    if (silent) {
      // status 'saved' or 'error' will linger; reset to idle after 3s
      setTimeout(() => setAutosaveStatus(s => (s === 'saved' || s === 'error') ? 'idle' : s), 3000);
    } else {
      setSaving(false);
    }
  };

  const deleteSimulation = (id) => {
    const target = simulations.find(s => s.id === id);
    if (!target) return;
    // Optimistic remove from list
    setSimulations(prev => prev.filter(s => s.id !== id));
    let undone = false;
    showToast(`"${target.client_name || 'Étude'}" supprimée`, 'success', {
      duration: 5000,
      action: {
        label: 'Annuler',
        onClick: () => {
          undone = true;
          setSimulations(prev => {
            // Re-insert at original position (best-effort: prepend)
            if (prev.find(s => s.id === id)) return prev;
            return [target, ...prev];
          });
          dismissToast();
        },
      },
      onTimeout: async () => {
        if (undone) return;
        try {
          const res = await apiCall(`/rest/v1/solar_simulations?id=eq.${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error(await res.text());
        } catch (e) {
          console.error(e);
          // Restore on failure
          setSimulations(prev => prev.find(s => s.id === id) ? prev : [target, ...prev]);
          showToast('Erreur de suppression — étude restaurée', 'error');
        }
      },
    });
  };

  const newSimulation = () => {
    setCurrentSim(initialSim);
    setStep(1); setOverrideMode(false); setView('edit');
  };

  const openSimulation = (sim) => {
    setCurrentSim({ ...initialSim, ...sim, appliances: sim.appliances || [] });
    setStep(1);
    setOverrideMode(sim.final_kwc != null && sim.final_kwc !== sim.recommended_kwc);
    setView('edit');
  };

  const updateSim = (patch) => {
    setCurrentSim(prev => ({ ...prev, ...patch }));
    setIsDirty(true);
    setAutosaveStatus('pending');
  };
  const calcs = useMemo(() => computeAll(currentSim), [currentSim]);

  // Autosave: 5s after last edit, only if simulation has a name and we're editing
  useEffect(() => {
    if (!isDirty) return;
    if (view !== 'edit') return;
    if (!currentSim.client_name?.trim()) return;
    if (saving || autosaveStatus === 'saving') return;
    const t = setTimeout(() => { saveSimulation({ silent: true }); }, 5000);
    return () => clearTimeout(t);
  }, [isDirty, currentSim, view, saving]); // eslint-disable-line react-hooks/exhaustive-deps

  // Warn before closing tab if unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Reset dirty flag when opening/creating a new simulation
  useEffect(() => {
    setIsDirty(false);
    setAutosaveStatus('idle');
    setLastSavedAt(currentSim.id ? Date.parse(currentSim.updated_at || currentSim.created_at || '') || null : null);
    setStepsAttempted({});
  }, [currentSim.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredSims = useMemo(() => {
    let result = simulations;
    if (filterCommercial) result = result.filter(s => s.created_by === filterCommercial);
    if (filterStatus) result = result.filter(s => s.status === filterStatus);
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(s =>
        s.client_name?.toLowerCase().includes(q) ||
        s.client_city?.toLowerCase().includes(q) ||
        s.client_postal_code?.includes(q) ||
        s.created_by_name?.toLowerCase().includes(q)
      );
    }
    // Sort (creates a new array to avoid mutating)
    const sorted = [...result];
    if (sortBy === 'name_asc') {
      sorted.sort((a, b) => (a.client_name || '').localeCompare(b.client_name || '', 'fr'));
    } else if (sortBy === 'kwc_desc') {
      sorted.sort((a, b) => (Number(b.final_kwc) || 0) - (Number(a.final_kwc) || 0));
    } else if (sortBy === 'status') {
      const order = { brouillon: 0, validé: 1, signé: 2, annulé: 3 };
      sorted.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));
    } else {
      // updated_desc (default)
      sorted.sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
    }
    return sorted;
  }, [simulations, searchQuery, filterCommercial, filterStatus, sortBy]);

  // Reset pagination when filters/sort change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterCommercial, filterStatus, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSims.length / PAGE_SIZE));
  const pagedSims = useMemo(
    () => filteredSims.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredSims, currentPage]
  );

  // Quick status update from a sim card (no full reload)
  const updateSimStatus = async (id, newStatus) => {
    const previous = simulations;
    // Optimistic update
    setSimulations(prev => prev.map(s => s.id === id ? { ...s, status: newStatus, updated_at: new Date().toISOString() } : s));
    try {
      const res = await apiCall(`/rest/v1/solar_simulations?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      showToast('Statut mis à jour');
    } catch (e) {
      console.error(e);
      setSimulations(previous);
      showToast('Erreur de mise à jour', 'error');
    }
  };

  if (adminView && isManager) {
    return (
      <UserManagement
        users={users}
        currentUserId={profile.id}
        onClose={() => setAdminView(false)}
        onUpdate={loadUsers}
        showToast={showToast}
      />
    );
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-slate-100">
        <Toast toast={toast} />
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                <Sun className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none tracking-tight">SOLAR SIM</h1>
                <p className="text-[11px] text-slate-500 leading-none mt-1 font-medium uppercase tracking-wider truncate">
                  {isManager ? 'Espace gestionnaire' : 'Espace commercial'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isManager && (
                <button
                  onClick={() => setAdminView(true)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-md font-semibold flex items-center gap-1.5 text-sm"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Équipe</span>
                </button>
              )}
              <button
                onClick={newSimulation}
                className="bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-all text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouvelle étude</span>
              </button>
              <UserMenu profile={profile} onLogout={onLogout} />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {simulations.length > 0 && (
            <div className={`grid gap-3 mb-6 ${isManager ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
              <StatBubble label="Études" value={simulations.length} icon={FileText} />
              <StatBubble label="Validées" value={simulations.filter(s => s.status === 'validé' || s.status === 'signé').length} icon={CheckCircle} accent />
              <StatBubble label="Total kWc" value={simulations.reduce((s, x) => s + (Number(x.final_kwc) || 0), 0).toFixed(1)} icon={Zap} />
              {isManager && (
                <StatBubble label="Commerciaux" value={users.filter(u => u.role === 'commercial' && u.active).length} icon={Briefcase} />
              )}
            </div>
          )}

          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={isManager ? "Rechercher (client, ville, commercial...)" : "Rechercher (client, ville, code postal...)"}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {isManager && (
                <select
                  value={filterCommercial}
                  onChange={e => setFilterCommercial(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Tous les commerciaux</option>
                  {users.filter(u => u.role === 'commercial').map(u => (
                    <option key={u.id} value={u.id}>{u.full_name}</option>
                  ))}
                </select>
              )}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Tous les statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="validé">Validé</option>
                <option value="signé">Signé</option>
                <option value="annulé">Annulé</option>
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900"
                title="Trier par"
              >
                <option value="updated_desc">↓ Plus récentes</option>
                <option value="name_asc">A → Z (nom)</option>
                <option value="kwc_desc">↓ kWc (plus grand)</option>
                <option value="status">Par statut</option>
              </select>
              {(filterCommercial || filterStatus || sortBy !== 'updated_desc') && (
                <button
                  onClick={() => { setFilterCommercial(''); setFilterStatus(''); setSortBy('updated_desc'); }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Effacer
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SimCardSkeleton key={i} />)}
            </div>
          ) : filteredSims.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-slate-200">
              <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center">
                <Sun className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {searchQuery || filterCommercial || filterStatus ? 'Aucun résultat' : 'Aucune étude'}
              </h3>
              <p className="text-slate-500 mb-6 text-sm">
                {searchQuery || filterCommercial || filterStatus
                  ? "Essayez d'autres critères"
                  : 'Démarrez votre première étude'}
              </p>
              {!searchQuery && !filterCommercial && !filterStatus && (
                <button onClick={newSimulation}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-md font-semibold inline-flex items-center gap-2 transition-all text-sm shadow-sm">
                  <Plus className="w-4 h-4" />
                  Nouvelle étude
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-500 mb-3 font-medium">
                {filteredSims.length} étude{filteredSims.length > 1 ? 's' : ''} · page {currentPage}/{totalPages}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagedSims.map(sim => (
                  <SimCard
                    key={sim.id}
                    sim={sim}
                    isManager={isManager}
                    onOpen={() => openSimulation(sim)}
                    onDelete={() => deleteSimulation(sim.id)}
                    onStatusChange={(newStatus) => updateSimStatus(sim.id, newStatus)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Précédent
                  </button>
                  <span className="text-sm font-semibold text-slate-700 px-3">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                  >
                    Suivant <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400">
          Connecté en tant que <strong>{profile.full_name}</strong> · Solar Sim
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-32">
      <Toast toast={toast} />
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-3 gap-2">
            <button onClick={() => setView('list')}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <div className="flex-1 text-center px-2 min-w-0">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Étape {step}/{STEPS.length}</div>
              <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
                {currentSim.client_name || 'Nouvelle étude'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SaveBadge dirty={isDirty} status={autosaveStatus} lastSavedAt={lastSavedAt} />
              {currentSim.id && step === 6 && (
                <button
                  onClick={() => generatePDF(currentSim, calcs, profile)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md font-semibold flex items-center gap-1.5 text-sm shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              )}
              <button onClick={() => saveSimulation()} disabled={saving}
                className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-md font-semibold flex items-center gap-1.5 transition-all disabled:opacity-60 text-sm shadow-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="hidden sm:inline">Enregistrer</span>
              </button>
            </div>
          </div>

          <div className="relative pt-2">
            <div className="absolute top-[18px] left-4 right-4 h-0.5 bg-slate-200">
              <div className="h-full bg-gradient-to-r from-slate-900 to-amber-500 transition-all duration-500"
                style={{ width: `${overallProgress(currentSim)}%` }} />
            </div>
            <div className="relative flex items-start justify-between">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isDone = step > s.id;
                return (
                  <button key={s.id} onClick={() => tryGoToStep(s.id)}
                    className="flex flex-col items-center gap-1.5 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-slate-900 text-amber-400 ring-4 ring-amber-100'
                      : isDone ? 'bg-slate-900 text-white'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-colors ${
                      isActive ? 'text-slate-900' : isDone ? 'text-slate-700' : 'text-slate-400'
                    }`}>{s.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {step === 1 && <StepClient sim={currentSim} update={updateSim} showToast={showToast} errors={visibleErrors} />}
        {step === 2 && <StepHousing sim={currentSim} update={updateSim} errors={visibleErrors} />}
        {step === 3 && <StepAppliances sim={currentSim} update={updateSim} />}
        {step === 4 && <StepConsumption sim={currentSim} update={updateSim} calcs={calcs} />}
        {step === 5 && <StepSizing sim={currentSim} update={updateSim} calcs={calcs} overrideMode={overrideMode} setOverrideMode={setOverrideMode} />}
        {step === 6 && <StepRecap sim={currentSim} calcs={calcs} profile={profile} />}

        <div className="flex items-center justify-between mt-8 gap-3">
          <button onClick={() => tryGoToStep(Math.max(1, step - 1))} disabled={step === 1}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-all flex items-center gap-1.5 text-sm">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Précédent</span>
          </button>
          {step < STEPS.length ? (
            <button onClick={() => tryGoToStep(Math.min(STEPS.length, step + 1))}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 text-sm shadow-sm">
              Continuer
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={saveSimulation} disabled={saving}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 text-sm shadow-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Finaliser l'étude
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// ============ USER MENU ============

function UserMenu({ profile, onLogout }) {
  const [open, setOpen] = useState(false);
  const initials = (profile.full_name || profile.username || '?').slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center hover:bg-slate-800 transition-colors"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 truncate text-sm">{profile.full_name}</div>
                <div className="text-xs text-slate-500 truncate">@{profile.username}</div>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-xs font-bold text-slate-700">
              {profile.role === 'gestionnaire' ? <Shield className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
              {profile.role === 'gestionnaire' ? 'Gestionnaire' : 'Commercial'}
            </div>
          </div>
          <button
            onMouseDown={onLogout}
            className="w-full px-4 py-3 text-left hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

// ============ USER MANAGEMENT ============

function UserManagement({ users, currentUserId, onClose, onUpdate, showToast }) {
  const [showCreate, setShowCreate] = useState(false);
  const [resetUser, setResetUser] = useState(null);

  const toggleRole = async (user) => {
    const newRole = user.role === 'gestionnaire' ? 'commercial' : 'gestionnaire';
    if (!confirm(`Passer ${user.full_name} en ${newRole} ?`)) return;
    try {
      const res = await apiCall(`/rest/v1/user_profiles?id=eq.${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      showToast(`Rôle mis à jour`);
      onUpdate();
    } catch (e) { showToast('Erreur', 'error'); }
  };

  const toggleActive = async (user) => {
    try {
      const res = await apiCall(`/rest/v1/user_profiles?id=eq.${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !user.active }),
      });
      if (!res.ok) throw new Error();
      showToast(user.active ? 'Compte désactivé' : 'Compte activé');
      onUpdate();
    } catch (e) { showToast('Erreur', 'error'); }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Supprimer définitivement le compte de ${user.full_name} ?\nCette action est irréversible.`)) return;
    try {
      const res = await apiCall(`/rest/v1/rpc/delete_user_account`, {
        method: 'POST',
        body: JSON.stringify({ p_user_id: user.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erreur de suppression');
      }
      showToast('Compte supprimé');
      onUpdate();
    } catch (e) { showToast(e.message || 'Erreur', 'error'); }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="text-slate-600 hover:text-slate-900 flex-shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none tracking-tight">GESTION ÉQUIPE</h1>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-1 truncate">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-md font-semibold flex items-center gap-2 text-sm shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Créer un compte</span>
            <span className="sm:hidden">Créer</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Card>
          <CardHeader icon={Users} title="Utilisateurs" subtitle="Gestion des accès et des rôles" />

          <div className="space-y-2">
            {users.map(u => {
              const isSelf = u.id === currentUserId;
              return (
                <div key={u.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-md border ${u.active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 ${
                      u.role === 'gestionnaire' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {(u.full_name || u.username || '?').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-900 text-sm truncate">{u.full_name}</div>
                        {isSelf && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">vous</span>}
                      </div>
                      <div className="text-xs text-slate-500 truncate">@{u.username || '—'}</div>
                    </div>
                    <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                      u.role === 'gestionnaire' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role === 'gestionnaire' ? <Shield className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setResetUser(u)}
                      className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md uppercase tracking-wider"
                      title="Réinitialiser mot de passe"
                    >
                      MDP
                    </button>
                    {!isSelf && (
                      <>
                        <button
                          onClick={() => toggleRole(u)}
                          className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md uppercase tracking-wider"
                        >
                          {u.role === 'gestionnaire' ? 'Rétrograder' : 'Promouvoir'}
                        </button>
                        <button
                          onClick={() => toggleActive(u)}
                          className={`px-2.5 py-1.5 text-xs font-bold rounded-md uppercase tracking-wider ${
                            u.active ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {u.active ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => deleteUser(u)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); onUpdate(); }}
          showToast={showToast}
        />
      )}

      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => setResetUser(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onCreated, showToast }) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('commercial');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let p = '';
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPassword(p);
    setShowPassword(true);
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Identifiant et mot de passe requis');
      return;
    }
    if (password.length < 6) {
      setError('Mot de passe trop court (6 caractères minimum)');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      setError('Identifiant : lettres, chiffres, _ et - uniquement (sans espace)');
      return;
    }
    setLoading(true);
    try {
      const res = await apiCall(`/rest/v1/rpc/create_user_account`, {
        method: 'POST',
        body: JSON.stringify({
          p_username: username.trim(),
          p_full_name: (fullName.trim() || username.trim()),
          p_password: password,
          p_role: role,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erreur de création');
      }
      showToast(`Compte ${username} créé`);
      onCreated();
    } catch (err) {
      setError(err.message || 'Erreur');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900">Créer un compte</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <Field label="Identifiant (prénom)" hint="Sera utilisé pour se connecter">
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Marie"
              autoCapitalize="off"
              required
            />
          </Field>

          <Field label="Nom complet (optionnel)">
            <Input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Marie Martin"
            />
          </Field>

          <Field label="Mot de passe initial">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                  title="Générer un mot de passe"
                >
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </Field>

          <Field label="Rôle">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('commercial')}
                className={`py-2.5 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
                  role === 'commercial' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Commercial
              </button>
              <button
                type="button"
                onClick={() => setRole('gestionnaire')}
                className={`py-2.5 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
                  role === 'gestionnaire' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                <Shield className="w-4 h-4" /> Gestionnaire
              </button>
            </div>
          </Field>

          {error && (
            <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          {password && username && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs">
              <div className="font-bold text-amber-900 mb-1">⚠️ À transmettre à l'utilisateur :</div>
              <div className="text-amber-800">
                <strong>Identifiant :</strong> {username}<br />
                <strong>Mot de passe :</strong> {password}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-700 hover:bg-slate-50 text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold flex items-center justify-center gap-2 disabled:opacity-60 text-sm shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Créer le compte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResetPasswordModal({ user, onClose, showToast }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let p = '';
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPassword(p);
    setShowPassword(true);
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    setError('');
    if (!password.trim() || password.length < 6) {
      setError('Mot de passe trop court (6 caractères minimum)');
      return;
    }
    setLoading(true);
    try {
      const res = await apiCall(`/rest/v1/rpc/reset_user_password`, {
        method: 'POST',
        body: JSON.stringify({
          p_user_id: user.id,
          p_new_password: password,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erreur');
      }
      setSuccess(true);
      showToast('Mot de passe réinitialisé');
    } catch (err) {
      setError(err.message || 'Erreur');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900">Réinitialiser le mot de passe</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Utilisateur</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{user.full_name}</div>
            <div className="text-xs text-slate-500">@{user.username}</div>
          </div>

          <Field label="Nouveau mot de passe">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </Field>

          {error && (
            <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          {success && password && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs">
              <div className="font-bold text-emerald-900 mb-1">✓ Mot de passe réinitialisé</div>
              <div className="text-emerald-800">
                <strong>Identifiant :</strong> {user.username}<br />
                <strong>Nouveau MDP :</strong> {password}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-700 hover:bg-slate-50 text-sm"
            >
              {success ? 'Fermer' : 'Annuler'}
            </button>
            {!success && (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold flex items-center justify-center gap-2 disabled:opacity-60 text-sm shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                Réinitialiser
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ============ COMPUTE ============

function numOrNull(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v); return isNaN(n) ? null : n;
}
function intOrNull(v) {
  const n = numOrNull(v); return n === null ? null : Math.round(n);
}

// ============ VALIDATION ============

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const POSTAL_RE = /^\d{5}$/;

// Per-step completion percentage (0-100), based on filled fields
function stepCompletion(step, sim) {
  if (step === 1) {
    let pts = 0, max = 5;
    if (sim.client_name?.trim()) pts += 2; // weight 2
    if (sim.client_phone?.trim()) pts += 1;
    if (sim.client_email?.trim()) pts += 1;
    if (sim.client_address?.trim() || sim.client_postal_code?.trim()) pts += 1;
    return Math.round((pts / max) * 100);
  }
  if (step === 2) {
    let pts = 0, max = 6;
    if (numOrNull(sim.surface_m2)) pts += 2;
    if (intOrNull(sim.occupants)) pts += 2;
    if (sim.region) pts += 1;
    if (sim.roof_orientation) pts += 0.5;
    if (Number(sim.roof_inclination) > 0) pts += 0.5;
    return Math.round((pts / max) * 100);
  }
  if (step === 3) {
    return (sim.appliances || []).length > 0 ? 100 : 0;
  }
  if (step === 4) {
    const hasApps = (sim.appliances || []).length > 0;
    const hasManual = numOrNull(sim.annual_consumption_kwh) > 0;
    return (hasApps || hasManual) ? 100 : 0;
  }
  if (step === 5) {
    return sim.final_kwc != null ? 100 : 50;
  }
  if (step === 6) {
    return 100;
  }
  return 0;
}

function overallProgress(sim) {
  const total = [1,2,3,4,5,6].reduce((sum, s) => sum + stepCompletion(s, sim), 0);
  return Math.round(total / 6);
}

function validateStep(step, sim) {
  const e = {};
  if (step === 1) {
    if (!sim.client_name?.trim()) e.client_name = 'Le nom du client est requis';
    else if (sim.client_name.trim().length < 2) e.client_name = 'Nom trop court';
    if (sim.client_email && !EMAIL_RE.test(sim.client_email.trim())) e.client_email = 'Format email invalide';
    if (sim.client_phone && !PHONE_RE.test(sim.client_phone.trim())) e.client_phone = 'Format téléphone invalide (ex: 06 12 34 56 78)';
    if (sim.client_postal_code && !POSTAL_RE.test(sim.client_postal_code.trim())) e.client_postal_code = 'Code postal: 5 chiffres';
  } else if (step === 2) {
    const surface = numOrNull(sim.surface_m2);
    if (surface === null) e.surface_m2 = 'Surface requise';
    else if (surface <= 0 || surface > 1000) e.surface_m2 = 'Entre 1 et 1000 m²';
    const occupants = intOrNull(sim.occupants);
    if (occupants === null) e.occupants = 'Nombre d\'occupants requis';
    else if (occupants < 1 || occupants > 20) e.occupants = 'Entre 1 et 20 personnes';
    const incl = Number(sim.roof_inclination);
    if (isNaN(incl) || incl < 0 || incl > 90) e.roof_inclination = 'Inclinaison entre 0° et 90°';
  } else if (step === 4) {
    const apps = sim.appliances || [];
    const conso = numOrNull(sim.annual_consumption_kwh);
    if (apps.length === 0 && (conso === null || conso <= 0)) {
      e.annual_consumption_kwh = 'Sélectionnez des appareils ou saisissez une consommation manuelle';
    } else if (conso !== null && conso < 0) {
      e.annual_consumption_kwh = 'La consommation doit être positive';
    }
  }
  return e;
}

function selectCommercialKwc(rawKwc) {
  if (rawKwc <= 3.5) return 3.5;
  if (rawKwc >= 9) return 9.0;
  for (const tier of KWC_TIERS) {
    if (rawKwc <= tier) return tier;
  }
  return 9.0;
}

function computeAll(sim) {
  const apps = sim.appliances || [];
  const estimatedConsumption = apps.reduce((sum, a) => {
    const baseKwh = Number(a.kwh_year) || 0;
    const daysCoef = (Number(a.days_per_week) || 7) / 7;
    return sum + baseKwh * daysCoef;
  }, 0);

  const refConsumption = numOrNull(sim.annual_consumption_kwh) || estimatedConsumption || 0;
  const sunshine = REGIONS[sim.region] || 1100;
  const orientCoef = ORIENTATION_COEF[sim.roof_orientation] || 1;
  const incl = Number(sim.roof_inclination) || 30;
  const inclCoef = incl >= 20 && incl <= 45 ? 1 : 0.95;
  const productionPerKwc = sunshine * orientCoef * inclCoef;

  let rawKwc;
  if (refConsumption <= 0) rawKwc = 3.5;
  else if (refConsumption <= 4000) rawKwc = 3.5;
  else if (refConsumption <= 5000) rawKwc = 4.0;
  else if (refConsumption <= 6000) rawKwc = 4.5;
  else rawKwc = (refConsumption * 0.85 / productionPerKwc);

  const recommendedKwc = selectCommercialKwc(rawKwc);
  const panelPower = Number(sim.panel_power_w) || 425;
  const recommendedPanels = Math.ceil((recommendedKwc * 1000) / panelPower);

  const finalKwc = sim.final_kwc != null ? Number(sim.final_kwc) : recommendedKwc;
  const finalPanels = sim.final_panels != null ? Number(sim.final_panels) : recommendedPanels;
  const production = Math.round(finalKwc * productionPerKwc);

  const ratio = refConsumption > 0 ? production / refConsumption : 0;
  let selfConsumptionRate;
  if (ratio < 0.5) selfConsumptionRate = 90;
  else if (ratio < 0.8) selfConsumptionRate = 80;
  else if (ratio < 1.2) selfConsumptionRate = 70;
  else selfConsumptionRate = 60;

  const co2Saved = Math.round(production * 0.06);

  return {
    estimatedConsumption: Math.round(estimatedConsumption),
    recommendedKwc, recommendedPanels,
    production, selfConsumptionRate,
    productionPerKwc: Math.round(productionPerKwc),
    co2Saved, finalKwc, finalPanels,
    refConsumption,
  };
}

// ============ PDF GENERATION ============

function generatePDF(sim, calcs, profile) {
  const finalKwc = sim.final_kwc ?? calcs.recommendedKwc;
  const finalPanels = sim.final_panels ?? calcs.recommendedPanels;
  const surface = Math.round(finalPanels * 1.95);
  const refConso = numOrNull(sim.annual_consumption_kwh) || calcs.estimatedConsumption;
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const ref = `SIM-${(sim.id || '').slice(0, 8).toUpperCase()}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Étude photovoltaïque - ${sim.client_name}</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; font-size: 10pt; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 3px solid #0f172a; margin-bottom: 25px; }
  .logo { display: flex; align-items: center; gap: 12px; }
  .logo-icon { width: 48px; height: 48px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fbbf24; font-size: 24px; }
  .logo-text h1 { font-size: 18pt; font-weight: 800; letter-spacing: -0.5px; }
  .logo-text p { font-size: 8pt; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
  .ref-block { text-align: right; font-size: 9pt; }
  .ref-block .label { color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-size: 7pt; font-weight: 700; }
  .ref-block .value { font-weight: 700; font-size: 11pt; margin-bottom: 4px; }
  .title { font-size: 22pt; font-weight: 800; letter-spacing: -1px; margin-bottom: 6px; }
  .subtitle { color: #64748b; font-size: 11pt; margin-bottom: 25px; }
  .hero { background: #0f172a; color: white; border-radius: 8px; padding: 25px; margin-bottom: 20px; }
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .hero-stat { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 16px; }
  .hero-stat .label { font-size: 8pt; opacity: 0.6; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
  .hero-stat .value { font-size: 28pt; font-weight: 800; color: #fbbf24; line-height: 1.1; margin-top: 4px; }
  .hero-stat .unit { font-size: 12pt; color: rgba(255,255,255,0.6); font-weight: 500; margin-left: 4px; }
  .hero-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
  .hero-mini { font-size: 9pt; }
  .hero-mini .label { opacity: 0.6; text-transform: uppercase; letter-spacing: 1.5px; font-size: 7pt; font-weight: 700; }
  .hero-mini .value { font-weight: 700; font-size: 13pt; }
  .hero-mini .value.accent { color: #fbbf24; }
  .section-title { font-size: 8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
  .section { margin-bottom: 18px; page-break-inside: avoid; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 18px; }
  .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 9.5pt; border-bottom: 1px dotted #e2e8f0; }
  .row:last-child { border-bottom: none; }
  .row .label { color: #64748b; }
  .row .value { font-weight: 700; text-align: right; }
  .equip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 6px; }
  .equip { padding: 6px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 8.5pt; display: flex; justify-content: space-between; }
  .equip .name { font-weight: 600; }
  .equip .kwh { color: #64748b; font-size: 7.5pt; }
  .impact { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
  .impact h3 { color: #065f46; font-size: 11pt; margin-bottom: 12px; }
  .impact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .impact-stat { background: white; border: 1px solid #a7f3d0; border-radius: 6px; padding: 10px; text-align: center; }
  .impact-stat .value { font-size: 18pt; font-weight: 800; color: #047857; }
  .impact-stat .label { font-size: 7pt; color: #047857; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-top: 4px; }
  .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 7.5pt; color: #94a3b8; line-height: 1.6; }
  .footer strong { color: #475569; }
  .notes { background: #f8fafc; border-left: 3px solid #0f172a; padding: 10px 14px; margin: 15px 0; font-size: 9pt; }
  .notes-title { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 700; margin-bottom: 4px; }
</style>
</head>
<body>

<div class="header">
  <div class="logo">
    <div class="logo-icon">☀</div>
    <div class="logo-text">
      <h1>SOLAR SIM</h1>
      <p>Études photovoltaïques</p>
    </div>
  </div>
  <div class="ref-block">
    <div class="label">Référence</div>
    <div class="value">${ref}</div>
    <div class="label">Date</div>
    <div style="font-weight:600">${today}</div>
  </div>
</div>

<div class="title">Étude photovoltaïque</div>
<div class="subtitle">Préconisation technique pour ${sim.client_name || 'le client'}</div>

<div class="hero">
  <div class="hero-grid">
    <div class="hero-stat">
      <div class="label">Puissance</div>
      <div class="value">${finalKwc}<span class="unit">kWc</span></div>
    </div>
    <div class="hero-stat">
      <div class="label">Panneaux</div>
      <div class="value">${finalPanels}<span class="unit">×${sim.panel_power_w}W</span></div>
    </div>
  </div>
  <div class="hero-bottom">
    <div class="hero-mini">
      <div class="label">Taux d'autoconsommation</div>
      <div class="value accent">${calcs.selfConsumptionRate}%</div>
    </div>
    <div class="hero-mini">
      <div class="label">Surface panneaux</div>
      <div class="value">${surface} m²</div>
    </div>
  </div>
</div>

<div class="grid-2">
  <div class="section">
    <div class="section-title">Client</div>
    <div class="row"><span class="label">Nom</span><span class="value">${sim.client_name || '—'}</span></div>
    <div class="row"><span class="label">Téléphone</span><span class="value">${sim.client_phone || '—'}</span></div>
    <div class="row"><span class="label">Email</span><span class="value">${sim.client_email || '—'}</span></div>
    <div class="row"><span class="label">Adresse</span><span class="value">${[sim.client_address, sim.client_postal_code, sim.client_city].filter(Boolean).join(', ') || '—'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Bien immobilier</div>
    <div class="row"><span class="label">Type</span><span class="value">${sim.housing_type || '—'}</span></div>
    <div class="row"><span class="label">Surface</span><span class="value">${sim.surface_m2 ? sim.surface_m2 + ' m²' : '—'}</span></div>
    <div class="row"><span class="label">Occupants</span><span class="value">${sim.occupants || '—'}</span></div>
    <div class="row"><span class="label">Chauffage</span><span class="value">${sim.heating_type || '—'}</span></div>
    <div class="row"><span class="label">Eau chaude</span><span class="value">${sim.hot_water_type || '—'}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Toiture & ensoleillement</div>
    <div class="row"><span class="label">Orientation</span><span class="value">${sim.roof_orientation || '—'}</span></div>
    <div class="row"><span class="label">Inclinaison</span><span class="value">${sim.roof_inclination}°</span></div>
    <div class="row"><span class="label">Région solaire</span><span class="value">${sim.region}</span></div>
    <div class="row"><span class="label">Ensoleillement</span><span class="value">${REGIONS[sim.region]} kWh/kWc/an</span></div>
  </div>

  <div class="section">
    <div class="section-title">Installation préconisée</div>
    <div class="row"><span class="label">Puissance</span><span class="value">${finalKwc} kWc</span></div>
    <div class="row"><span class="label">Nombre de panneaux</span><span class="value">${finalPanels} × ${sim.panel_power_w}W</span></div>
    <div class="row"><span class="label">Surface</span><span class="value">~${surface} m²</span></div>
    <div class="row"><span class="label">Conso annuelle</span><span class="value">${refConso.toLocaleString('fr-FR')} kWh</span></div>
    <div class="row"><span class="label">Autoconsommation</span><span class="value">${calcs.selfConsumptionRate}%</span></div>
  </div>
</div>

${(sim.appliances || []).length > 0 ? `
<div class="section">
  <div class="section-title">Inventaire des équipements (${(sim.appliances || []).length})</div>
  <div class="equip-grid">
    ${(sim.appliances || []).map(a => `
      <div class="equip">
        <span class="name">${a.emoji || '⚡'} ${a.name}</span>
        <span class="kwh">${Math.round((Number(a.kwh_year) || 0) * ((Number(a.days_per_week) || 7) / 7))} kWh</span>
      </div>
    `).join('')}
  </div>
</div>
` : ''}

${sim.notes ? `
<div class="notes">
  <div class="notes-title">Observations</div>
  <div>${sim.notes.replace(/\n/g, '<br>')}</div>
</div>
` : ''}

<div class="impact">
  <h3>🌱 Impact environnemental — projection 25 ans</h3>
  <div class="impact-grid">
    <div class="impact-stat">
      <div class="value">${calcs.co2Saved.toLocaleString('fr-FR')}</div>
      <div class="label">kg CO₂ / an</div>
    </div>
    <div class="impact-stat">
      <div class="value">${(calcs.co2Saved * 25 / 1000).toFixed(1)} t</div>
      <div class="label">CO₂ évité 25 ans</div>
    </div>
    <div class="impact-stat">
      <div class="value">${Math.round(calcs.co2Saved * 25 / 22)}</div>
      <div class="label">arbres équivalents</div>
    </div>
  </div>
</div>

<div class="footer">
  <strong>Étude établie par ${profile.full_name}</strong><br>
  Document à valeur indicative · Établi le ${today} · Référence ${ref}<br>
  Solar Sim — Outil professionnel d'étude photovoltaïque
</div>

</body>
</html>
  `;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Le navigateur a bloqué la fenêtre. Autorisez les popups pour cette page.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    setTimeout(() => { win.focus(); win.print(); }, 250);
  };
}

// ============ UI COMPONENTS ============

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-xl text-white font-semibold flex items-center gap-3 text-sm ${
      toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'
    }`}>
      {toast.type === 'error' ? <X className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
      <span>{toast.msg}</span>
      {toast.action && (
        <button
          onClick={toast.action.onClick}
          className="ml-2 px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded text-xs font-bold uppercase tracking-wider transition-colors"
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
}

function SaveBadge({ dirty, status, lastSavedAt }) {
  // Live timer: re-render every 30s to refresh "il y a Xs"
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!lastSavedAt) return;
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  const formatAgo = (ts) => {
    if (!ts) return '';
    const sec = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (sec < 5) return "à l'instant";
    if (sec < 60) return `il y a ${sec}s`;
    const min = Math.round(sec / 60);
    if (min < 60) return `il y a ${min} min`;
    const h = Math.round(min / 60);
    return `il y a ${h}h`;
  };

  if (status === 'saving') {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 px-2">
        <Loader2 className="w-3 h-3 animate-spin" />
        Enregistrement…
      </span>
    );
  }
  if (dirty || status === 'pending') {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Modifié
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
        <AlertCircle className="w-3 h-3" />
        Échec autosave
      </span>
    );
  }
  if (lastSavedAt) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 px-2">
        <CheckCircle className="w-3 h-3" />
        Enregistré {formatAgo(lastSavedAt)}
      </span>
    );
  }
  return null;
}

function StatBubble({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200">
      <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-2 ${accent ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
      <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

function SimCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200 animate-pulse">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
        <div className="w-16 h-5 bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 rounded-md p-3 h-16" />
        <div className="bg-slate-50 rounded-md p-3 h-16" />
      </div>
      <div className="h-9 bg-slate-100 rounded-md" />
    </div>
  );
}

const SimCard = React.memo(function SimCard({ sim, isManager, onOpen, onDelete, onStatusChange }) {
  const statusConfig = {
    'brouillon': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
    'validé': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    'signé': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'annulé': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  };
  const cfg = statusConfig[sim.status] || statusConfig.brouillon;

  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 truncate">{sim.client_name || 'Sans nom'}</h3>
          <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {sim.client_city || sim.client_postal_code || sim.region || '—'}
          </p>
        </div>
        {onStatusChange ? (
          <div className="relative flex-shrink-0">
            <select
              value={sim.status || 'brouillon'}
              onChange={e => { e.stopPropagation(); onStatusChange(e.target.value); }}
              onClick={e => e.stopPropagation()}
              title="Changer le statut"
              className={`appearance-none cursor-pointer pl-5 pr-6 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text} border-0 outline-none focus:ring-2 focus:ring-slate-900`}
            >
              <option value="brouillon">Brouillon</option>
              <option value="validé">Validé</option>
              <option value="signé">Signé</option>
              <option value="annulé">Annulé</option>
            </select>
            <span className={`pointer-events-none w-1.5 h-1.5 rounded-full ${cfg.dot} absolute left-2 top-1/2 -translate-y-1/2`} />
            <ChevronRight className={`pointer-events-none w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 rotate-90 ${cfg.text}`} />
          </div>
        ) : (
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text} flex items-center gap-1.5 flex-shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {sim.status || 'brouillon'}
          </span>
        )}
      </div>

      {isManager && sim.created_by_name && (
        <div className="mb-3 px-2.5 py-1.5 bg-slate-50 rounded text-xs flex items-center gap-1.5">
          <Briefcase className="w-3 h-3 text-slate-400" />
          <span className="text-slate-500 font-medium">Commercial :</span>
          <span className="font-bold text-slate-700 truncate">{sim.created_by_name}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
          <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">
            <Zap className="w-3 h-3" /> Puissance
          </div>
          <div className="text-xl font-bold text-slate-900">
            {sim.final_kwc ? `${sim.final_kwc}` : '—'}
            <span className="text-xs ml-0.5 text-slate-500 font-medium">kWc</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
          <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">
            <BarChart3 className="w-3 h-3" /> Panneaux
          </div>
          <div className="text-xl font-bold text-slate-900">{sim.final_panels || '—'}</div>
        </div>
      </div>

      {sim.self_consumption_rate > 0 && (
        <div className="mb-3 px-3 py-2 bg-amber-50 rounded-md border border-amber-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Autoconsommation</span>
          <span className="text-sm font-bold text-amber-900">{sim.self_consumption_rate}%</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={onOpen}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors">
          <Edit className="w-4 h-4" /> Ouvrir
        </button>
        <button onClick={onDelete}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg p-5 sm:p-6 border border-slate-200 ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title, subtitle, num }) {
  return (
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-slate-100">
      <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-amber-400" />
      </div>
      <div className="min-w-0 flex-1">
        {num && <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Section {num}</div>}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 leading-tight mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({ label, children, className = '', hint, error, required }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-widest">
          {label}
          {required && <span className="text-red-500 ml-1 normal-case">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-600 mt-1.5 flex items-start gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-400 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}

function Input(props) {
  const { className, error, ...rest } = props;
  const borderClasses = error
    ? 'border-red-400 focus:ring-red-500 bg-red-50/30'
    : 'border-slate-200 focus:ring-slate-900';
  return (
    <input {...rest}
      aria-invalid={error ? 'true' : undefined}
      className={`w-full px-3.5 py-2.5 bg-white border rounded-md focus:ring-2 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm ${borderClasses} ${className || ''}`}
    />
  );
}

function Select({ children, className, error, ...rest }) {
  const borderClasses = error
    ? 'border-red-400 focus:ring-red-500 bg-red-50/30'
    : 'border-slate-200 focus:ring-slate-900';
  return (
    <select {...rest}
      aria-invalid={error ? 'true' : undefined}
      className={`w-full px-3.5 py-2.5 bg-white border rounded-md focus:ring-2 focus:border-transparent outline-none transition-all appearance-none text-slate-900 text-sm ${borderClasses} ${className || ''}`}
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%2364748b%27 d=%27M3 4l3 3 3-3z%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }}
    >
      {children}
    </select>
  );
}

// ============ STEPS ============

// Module-level cache shared across all StepClient renders. Survives step navigation, cleared on reload.
const ADDRESS_CACHE = new Map(); // key: normalized query, value: features[]
const ADDRESS_CACHE_MAX = 50;

function StepClient({ sim, update, showToast, errors = {} }) {
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const debounceRef = useRef(null);

  const searchAddress = (query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 3) { setSuggestions([]); setShowSuggest(false); return; }
    const key = query.trim().toLowerCase();
    // Cache hit -> instant render, skip debounce
    if (ADDRESS_CACHE.has(key)) {
      setSuggestions(ADDRESS_CACHE.get(key));
      setShowSuggest(true);
      setSearching(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        const features = data.features || [];
        // Save in cache (LRU eviction when full)
        if (ADDRESS_CACHE.size >= ADDRESS_CACHE_MAX) {
          const firstKey = ADDRESS_CACHE.keys().next().value;
          ADDRESS_CACHE.delete(firstKey);
        }
        ADDRESS_CACHE.set(key, features);
        setSuggestions(features);
        setShowSuggest(true);
      } catch (e) { setSuggestions([]); }
      setSearching(false);
    }, 500);
  };

  const selectAddress = (feature) => {
    const p = feature.properties;
    const postal = p.postcode || '';
    let dept = postal.substring(0, 2);
    if (postal.startsWith('20') && postal.length >= 5) {
      const num = parseInt(postal, 10);
      dept = num >= 20200 ? '2B' : '2A';
    }
    const region = DEPT_TO_REGION[dept] || sim.region;
    update({ client_address: p.name || '', client_postal_code: postal, client_city: p.city || '', region });
    setShowSuggest(false);
    setSuggestions([]);
    showToast(`Adresse trouvée • ${region}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader icon={User} title="Informations client" subtitle="Coordonnées du prospect" num="01" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nom complet" required className="sm:col-span-2" error={errors.client_name}>
            <Input value={sim.client_name} onChange={e => update({ client_name: e.target.value })} placeholder="Jean Dupont" error={errors.client_name} />
          </Field>
          <Field label="Téléphone" error={errors.client_phone}>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={sim.client_phone} onChange={e => update({ client_phone: e.target.value })} placeholder="06 12 34 56 78" className="pl-9" error={errors.client_phone} />
            </div>
          </Field>
          <Field label="Email" error={errors.client_email}>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={sim.client_email} onChange={e => update({ client_email: e.target.value })} placeholder="email@exemple.fr" type="email" className="pl-9" error={errors.client_email} />
            </div>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader icon={MapPin} title="Adresse du chantier" subtitle="Saisie automatique via la Base Adresse Nationale" num="02" />
        <div className="space-y-3">
          <Field label="Recherche d'adresse">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <input
                type="text" value={sim.client_address || ''}
                onChange={e => { update({ client_address: e.target.value }); searchAddress(e.target.value); }}
                onFocus={() => sim.client_address && searchAddress(sim.client_address)}
                onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
                placeholder="Tapez l'adresse complète..."
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm"
              />
              {searching && <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-500" />}
              {showSuggest && suggestions.length > 0 && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button key={i} onMouseDown={e => { e.preventDefault(); selectAddress(s); }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-900 truncate">{s.properties.name}</div>
                        <div className="text-xs text-slate-500 truncate">{s.properties.postcode} {s.properties.city}{s.properties.context && <span className="text-slate-400"> · {s.properties.context}</span>}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Code postal" error={errors.client_postal_code}>
              <Input value={sim.client_postal_code || ''} error={errors.client_postal_code} onChange={e => {
                const cp = e.target.value;
                update({ client_postal_code: cp });
                if (cp.length >= 2) {
                  let dept = cp.substring(0, 2);
                  if (cp.startsWith('20') && cp.length >= 5) {
                    const num = parseInt(cp, 10);
                    dept = num >= 20200 ? '2B' : '2A';
                  }
                  const region = DEPT_TO_REGION[dept];
                  if (region && region !== sim.region) update({ region });
                }
              }} placeholder="75001" />
            </Field>
            <Field label="Ville" className="col-span-2">
              <Input value={sim.client_city || ''} onChange={e => update({ client_city: e.target.value })} placeholder="Paris" />
            </Field>
          </div>
          {sim.region && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-md border border-slate-200">
              <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div className="flex-1 text-xs min-w-0">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Région solaire</span>
                <span className="font-bold text-slate-900 ml-1.5">{sim.region}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{REGIONS[sim.region]} kWh/kWc</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function StepHousing({ sim, update, errors = {} }) {
  const orientations = [
    { val: 'Sud', emoji: '⬇', score: 100 },
    { val: 'Sud-Est', emoji: '↙', score: 95 },
    { val: 'Sud-Ouest', emoji: '↘', score: 95 },
    { val: 'Est', emoji: '⬅', score: 85 },
    { val: 'Ouest', emoji: '➡', score: 85 },
    { val: 'Nord', emoji: '⬆', score: 60 },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader icon={Home} title="Caractéristiques du logement" subtitle="Type, surface et occupants" num="03" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Type de logement">
            <div className="grid grid-cols-2 gap-2">
              {['Maison', 'Appartement'].map(t => (
                <button key={t} onClick={() => update({ housing_type: t })}
                  className={`py-2.5 rounded-md font-semibold text-sm transition-all ${sim.housing_type === t ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Surface habitable (m²)" required error={errors.surface_m2}>
            <Input type="number" value={sim.surface_m2} onChange={e => update({ surface_m2: e.target.value })} placeholder="120" error={errors.surface_m2} />
          </Field>
          <Field label="Nombre d'occupants" required error={errors.occupants}>
            <div className="flex items-center gap-2">
              <button onClick={() => update({ occupants: Math.max(1, (Number(sim.occupants) || 1) - 1) })}
                className="w-10 h-10 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-lg text-slate-700">−</button>
              <Input type="number" value={sim.occupants} onChange={e => update({ occupants: e.target.value })} placeholder="4" className="text-center font-bold" error={errors.occupants} />
              <button onClick={() => update({ occupants: (Number(sim.occupants) || 0) + 1 })}
                className="w-10 h-10 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-lg text-slate-700">+</button>
            </div>
          </Field>
          <Field label="Région solaire">
            <Select value={sim.region} onChange={e => update({ region: e.target.value })}>
              {Object.entries(REGIONS).map(([r, v]) => <option key={r} value={r}>{r} ({v} kWh)</option>)}
            </Select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader icon={Flame} title="Énergies du logement" subtitle="Chauffage et eau chaude actuels" num="04" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Chauffage">
            <Select value={sim.heating_type} onChange={e => update({ heating_type: e.target.value })}>
              <option>Électrique</option><option>Gaz</option><option>Pompe à chaleur</option>
              <option>Bois / pellets</option><option>Fioul</option><option>Autre</option>
            </Select>
          </Field>
          <Field label="Eau chaude sanitaire">
            <Select value={sim.hot_water_type} onChange={e => update({ hot_water_type: e.target.value })}>
              <option>Ballon électrique</option><option>Ballon thermodynamique</option>
              <option>Gaz</option><option>Solaire</option><option>Couplé chauffage</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader icon={Compass} title="Toiture" subtitle="Orientation et inclinaison" num="05" />
        <Field label="Orientation">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {orientations.map(o => (
              <button key={o.val} onClick={() => update({ roof_orientation: o.val })}
                className={`p-2.5 rounded-md border transition-all ${sim.roof_orientation === o.val ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                <div className="text-lg mb-0.5">{o.emoji}</div>
                <div className={`text-[10px] font-bold ${sim.roof_orientation === o.val ? 'text-white' : 'text-slate-700'}`}>{o.val}</div>
                <div className={`text-[9px] font-bold mt-0.5 ${sim.roof_orientation === o.val ? 'text-amber-400' : o.score >= 95 ? 'text-emerald-600' : o.score >= 85 ? 'text-amber-600' : 'text-red-500'}`}>{o.score}%</div>
              </button>
            ))}
          </div>
        </Field>
        <Field label={`Inclinaison : ${sim.roof_inclination}°`} className="mt-4" error={errors.roof_inclination}>
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {[
              { val: 0, label: 'Plat', sub: '0°' },
              { val: 15, label: 'Faible', sub: '15°' },
              { val: 30, label: 'Standard', sub: '30°' },
              { val: 35, label: 'Optimal', sub: '35°' },
              { val: 45, label: 'Forte', sub: '45°' },
            ].map(p => {
              const active = Number(sim.roof_inclination) === p.val;
              return (
                <button
                  key={p.val}
                  onClick={() => update({ roof_inclination: p.val })}
                  className={`p-2 rounded-md border text-center transition-all ${active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-400 text-slate-700'}`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className={`text-[10px] mt-0.5 ${active ? 'text-amber-400' : 'text-slate-500'}`}>{p.sub}</div>
                </button>
              );
            })}
          </div>
          <input type="range" min="0" max="60" value={sim.roof_inclination}
            onChange={e => update({ roof_inclination: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900" />
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>0° (plat)</span>
            <span className={sim.roof_inclination >= 20 && sim.roof_inclination <= 45 ? 'text-emerald-600 font-bold' : ''}>30° optimal</span>
            <span>60°</span>
          </div>
        </Field>
      </Card>
    </div>
  );
}

function StepAppliances({ sim, update }) {
  const apps = sim.appliances || [];
  const [activeCategory, setActiveCategory] = useState('cuisine');
  const [searchQuery, setSearchQuery] = useState('');

  // Build search results across all categories when user types
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    const matches = [];
    APPLIANCE_CATEGORIES.forEach(cat => {
      cat.items.forEach(item => {
        if (item.name.toLowerCase().includes(q)) {
          matches.push({ item, category: cat });
        }
      });
    });
    return matches;
  }, [searchQuery]);

  const getQuantity = (name) => apps.filter(a => a.name === name).length;
  const isSelected = (name) => getQuantity(name) > 0;

  const toggleAppliance = (item) => {
    if (isSelected(item.name)) {
      const idx = apps.findIndex(a => a.name === item.name);
      const newApps = [...apps];
      newApps.splice(idx, 1);
      update({ appliances: newApps });
    } else {
      update({ appliances: [...apps, { id: Date.now() + Math.random(), name: item.name, kwh_year: item.kwh_year, days_per_week: 7, emoji: item.emoji }] });
    }
  };

  const addInstance = (item) => {
    update({ appliances: [...apps, { id: Date.now() + Math.random(), name: item.name, kwh_year: item.kwh_year, days_per_week: 7, emoji: item.emoji }] });
  };

  const removeOne = (name) => {
    const idx = apps.findIndex(a => a.name === name);
    if (idx === -1) return;
    const newApps = [...apps];
    newApps.splice(idx, 1);
    update({ appliances: newApps });
  };

  const total = apps.reduce((sum, a) => {
    const baseKwh = Number(a.kwh_year) || 0;
    const daysCoef = (Number(a.days_per_week) || 7) / 7;
    return sum + baseKwh * daysCoef;
  }, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader icon={Zap} title="Inventaire des équipements" subtitle="Sélectionnez les appareils du logement" num="06" />

        <div className="bg-slate-900 rounded-md p-4 text-white mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Conso estimée</div>
            <div className="text-2xl font-bold mt-0.5">{Math.round(total).toLocaleString('fr-FR')}<span className="text-sm font-medium opacity-70 ml-1">kWh/an</span></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Équipements</div>
            <div className="text-2xl font-bold text-amber-400 mt-0.5">{apps.length}</div>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un appareil (frigo, voiture, piscine...)"
            className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!searchQuery && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 mb-4">
            {APPLIANCE_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <span>{cat.emoji}</span>{cat.label}
              </button>
            ))}
          </div>
        )}

        {searchQuery && searchResults && searchResults.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-500">
            Aucun appareil pour « {searchQuery} »
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {(searchQuery ? (searchResults || []).map(r => r.item) : (APPLIANCE_CATEGORIES.find(c => c.id === activeCategory)?.items || [])).map((item, i) => {
            const selected = isSelected(item.name);
            const qty = getQuantity(item.name);
            const matchCat = searchQuery ? searchResults.find(r => r.item === item)?.category : null;
            return (
              <button key={`${item.name}-${i}`} onClick={() => toggleAppliance(item)}
                className={`relative p-3 rounded-md border transition-all text-left ${selected ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                {selected && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center"><CheckCircle className="w-3.5 h-3.5 text-amber-400" /></div>}
                <div className="text-3xl mb-1.5">{item.emoji}</div>
                <div className="text-xs font-bold text-slate-900 mb-0.5 leading-tight">{item.name}</div>
                <div className="text-[10px] text-slate-500">{item.kwh_year} kWh/an</div>
                {matchCat && <div className="text-[9px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">{matchCat.emoji} {matchCat.label}</div>}
                {qty > 1 && <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">×{qty}</div>}
                {selected && (
                  <div className="mt-2 flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); removeOne(item.name); }}
                      className="flex-1 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">−</button>
                    <button onClick={(e) => { e.stopPropagation(); addInstance(item); }}
                      className="flex-1 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-colors">+</button>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {apps.length > 0 && (
        <Card>
          <CardHeader icon={Settings} title="Paramètres détaillés" subtitle="Affinez la consommation de chaque équipement" />
          <div className="space-y-2">
            {apps.map(a => {
              const baseKwh = Number(a.kwh_year) || 0;
              const daysCoef = (Number(a.days_per_week) || 7) / 7;
              const kwh = Math.round(baseKwh * daysCoef);
              return (
                <div key={a.id} className="bg-slate-50 rounded-md p-3 border border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-2xl">{a.emoji || '⚡'}</span>
                      <div className="font-bold text-slate-900 truncate text-sm">{a.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded whitespace-nowrap">{kwh} kWh/an</span>
                      <button onClick={() => update({ appliances: apps.filter(x => x.id !== a.id) })}
                        className="text-slate-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Conso annuelle (kWh)</label>
                      <input type="number" value={a.kwh_year}
                        onChange={e => update({ appliances: apps.map(x => x.id === a.id ? { ...x, kwh_year: Number(e.target.value) } : x) })}
                        className="w-full px-2 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Jours/semaine</label>
                      <input type="number" max="7" min="1" value={a.days_per_week || 7}
                        onChange={e => update({ appliances: apps.map(x => x.id === a.id ? { ...x, days_per_week: Number(e.target.value) } : x) })}
                        className="w-full px-2 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

function StepConsumption({ sim, update, calcs }) {
  const real = numOrNull(sim.annual_consumption_kwh) || 0;
  const estimated = calcs.estimatedConsumption;
  const diff = real && estimated ? Math.abs(real - estimated) : 0;
  const diffPct = real && estimated ? Math.round((diff / Math.max(real, estimated)) * 100) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader icon={BarChart3} title="Consommation annuelle" subtitle="Donnée issue de la facture client" num="07" />
        <Field label="Consommation annuelle" hint="Indiquée sur la facture annuelle de fourniture d'électricité">
          <div className="relative">
            <Input type="number" value={sim.annual_consumption_kwh}
              onChange={e => update({ annual_consumption_kwh: e.target.value })}
              placeholder="6500" className="text-2xl font-bold pr-16 py-3" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 uppercase tracking-wider">kWh</span>
          </div>
        </Field>

        {real > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conso réelle</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{real.toLocaleString('fr-FR')}<span className="text-xs ml-1 font-medium text-slate-500">kWh</span></div>
            </div>
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estimation appareils</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{estimated.toLocaleString('fr-FR')}<span className="text-xs ml-1 font-medium text-slate-500">kWh</span></div>
            </div>
          </div>
        )}
      </Card>

      {real > 0 && estimated > 0 && (
        <Card className={diffPct < 25 ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${diffPct < 25 ? 'bg-emerald-600' : 'bg-amber-600'}`}>
              {diffPct < 25 ? <CheckCircle className="w-5 h-5 text-white" /> : <Calculator className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-sm ${diffPct < 25 ? 'text-emerald-900' : 'text-amber-900'}`}>
                {diffPct < 25 ? 'Cohérence vérifiée' : 'Écart à analyser'}
              </h3>
              <p className={`text-xs mt-1 ${diffPct < 25 ? 'text-emerald-700' : 'text-amber-700'}`}>
                Écart : <strong>{diff.toLocaleString('fr-FR')} kWh ({diffPct}%)</strong>
                {diffPct >= 25 && " — vérifiez l'inventaire des appareils ou la facture client"}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader icon={Gauge} title="Profil de consommation" subtitle="Visualisation comparative" />
        <div className="space-y-3">
          <ConsoBar label="Réel facture" value={real} max={Math.max(real, estimated, 1)} dark />
          <ConsoBar label="Estimé appareils" value={estimated} max={Math.max(real, estimated, 1)} />
        </div>
      </Card>
    </div>
  );
}

function ConsoBar({ label, value, max, dark }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-slate-900">{value.toLocaleString('fr-FR')} kWh</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${dark ? 'bg-slate-900' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StepSizing({ sim, update, calcs, overrideMode, setOverrideMode }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-lg p-5 sm:p-6 text-white border border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center"><Sparkles className="w-4 h-4 text-amber-400" /></div>
          <h3 className="font-bold text-sm uppercase tracking-widest">Préconisation technique</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Puissance</div>
            <div className="text-4xl font-bold text-amber-400">{calcs.recommendedKwc}<span className="text-base ml-1 text-white/60 font-medium">kWc</span></div>
          </div>
          <div>
            <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Panneaux</div>
            <div className="text-4xl font-bold text-amber-400">{calcs.recommendedPanels}<span className="text-base ml-1 text-white/60 font-medium">u.</span></div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="opacity-60 font-bold uppercase tracking-wider text-[10px]">Taux d'autoconsommation</div>
          <div className="font-bold text-amber-400 mt-0.5 text-2xl">{calcs.selfConsumptionRate}%</div>
        </div>
      </div>

      <Card>
        <CardHeader icon={Settings} title="Configuration des panneaux" subtitle="Puissance unitaire des modules" num="08" />
        <Field label="Puissance par panneau">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PANEL_OPTIONS.map(p => (
              <button key={p} onClick={() => update({ panel_power_w: p, final_panels: null })}
                className={`py-2.5 rounded-md font-bold text-sm transition-all ${sim.panel_power_w === p ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'}`}>
                {p}W
              </button>
            ))}
          </div>
        </Field>
      </Card>

      <Card className={overrideMode ? 'border-amber-200 bg-amber-50/30' : ''}>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center ${overrideMode ? 'bg-amber-500' : 'bg-slate-200'}`}>
              <Target className={`w-4 h-4 ${overrideMode ? 'text-white' : 'text-slate-500'}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Ajustement manuel</h3>
              <p className="text-xs text-slate-500">Fixer la puissance commerciale finale</p>
            </div>
          </div>
          <button onClick={() => { if (overrideMode) update({ final_kwc: null, final_panels: null }); setOverrideMode(!overrideMode); }}
            className={`relative w-11 h-6 rounded-full transition-colors ${overrideMode ? 'bg-slate-900' : 'bg-slate-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${overrideMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {overrideMode && (
          <>
            <Field label="Sélection rapide" className="mb-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {KWC_TIERS.map(k => (
                  <button key={k} onClick={() => {
                    const panels = Math.ceil((k * 1000) / sim.panel_power_w);
                    update({ final_kwc: k, final_panels: panels });
                  }}
                    className={`py-2 rounded-md font-bold text-sm transition-all ${sim.final_kwc === k ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'}`}>
                    {k}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="kWc final">
                <Input type="number" step="0.5" value={sim.final_kwc ?? ''}
                  onChange={e => {
                    const kwc = numOrNull(e.target.value);
                    const panels = kwc ? Math.ceil((kwc * 1000) / sim.panel_power_w) : null;
                    update({ final_kwc: kwc, final_panels: panels });
                  }}
                  placeholder={`${calcs.recommendedKwc}`} className="text-lg font-bold" />
              </Field>
              <Field label="Nb panneaux">
                <Input type="number" value={sim.final_panels ?? ''}
                  onChange={e => {
                    const panels = intOrNull(e.target.value);
                    const kwc = panels ? Math.round((panels * sim.panel_power_w / 1000) * 10) / 10 : null;
                    update({ final_panels: panels, final_kwc: kwc });
                  }}
                  placeholder={`${calcs.recommendedPanels}`} className="text-lg font-bold" />
              </Field>
            </div>
          </>
        )}
      </Card>

      <Card>
        <CardHeader icon={FileText} title="Notes & statut" subtitle="Informations complémentaires" num="09" />
        <Field label="Observations">
          <textarea value={sim.notes || ''} onChange={e => update({ notes: e.target.value })}
            placeholder="Remarques sur le projet, contraintes spécifiques..." rows={3}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-y text-sm" />
        </Field>
        <Field label="Statut" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['brouillon', 'validé', 'signé', 'annulé'].map(s => (
              <button key={s} onClick={() => update({ status: s })}
                className={`py-2.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${sim.status === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {s}
              </button>
            ))}
          </div>
        </Field>
      </Card>
    </div>
  );
}

function StepRecap({ sim, calcs, profile }) {
  const finalKwc = sim.final_kwc ?? calcs.recommendedKwc;
  const finalPanels = sim.final_panels ?? calcs.recommendedPanels;
  const refConso = numOrNull(sim.annual_consumption_kwh) || calcs.estimatedConsumption;
  const surface = Math.round(finalPanels * 1.95);
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="relative bg-slate-900 rounded-lg p-6 text-white overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full -mr-20 -mt-20 blur-2xl" />
        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/10 rounded-md flex items-center justify-center border border-white/10">
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Étude photovoltaïque</div>
                <div className="text-xl sm:text-2xl font-bold leading-tight">{sim.client_name || 'Client'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Date</div>
              <div className="text-xs font-semibold mt-0.5">{today}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-md p-4 border border-white/10">
              <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Puissance</div>
              <div className="text-3xl font-bold text-amber-400">{finalKwc}<span className="text-base ml-1 text-white/60 font-medium">kWc</span></div>
            </div>
            <div className="bg-white/5 rounded-md p-4 border border-white/10">
              <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Panneaux</div>
              <div className="text-3xl font-bold text-amber-400">{finalPanels}<span className="text-base ml-1 text-white/60 font-medium">×{sim.panel_power_w}W</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <MiniStat label="Autoconsommation" value={`${calcs.selfConsumptionRate}%`} highlight />
            <MiniStat label="Surface panneaux" value={`${surface}`} unit="m²" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <BigStat icon={TrendingUp} label="Autoconsommation" value={`${calcs.selfConsumptionRate}%`} accent />
        <BigStat icon={Home} label="Surface" value={surface} unit="m²" />
      </div>

      <Card>
        <CardHeader icon={FileText} title="Détails techniques" subtitle="Récapitulatif complet de l'étude" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <Section title="Client">
            <Row label="Nom" value={sim.client_name} />
            <Row label="Téléphone" value={sim.client_phone} />
            <Row label="Email" value={sim.client_email} />
            <Row label="Adresse" value={[sim.client_address, sim.client_postal_code, sim.client_city].filter(Boolean).join(', ')} />
          </Section>

          <Section title="Bien immobilier">
            <Row label="Type" value={sim.housing_type} />
            <Row label="Surface" value={sim.surface_m2 ? `${sim.surface_m2} m²` : null} />
            <Row label="Occupants" value={sim.occupants} />
            <Row label="Chauffage" value={sim.heating_type} />
            <Row label="Eau chaude" value={sim.hot_water_type} />
          </Section>

          <Section title="Toiture">
            <Row label="Orientation" value={sim.roof_orientation} />
            <Row label="Inclinaison" value={`${sim.roof_inclination}°`} />
            <Row label="Région solaire" value={sim.region} />
            <Row label="Ensoleillement" value={`${REGIONS[sim.region]} kWh/kWc/an`} />
          </Section>

          <Section title="Installation">
            <Row label="Puissance" value={`${finalKwc} kWc`} />
            <Row label="Nb panneaux" value={`${finalPanels} × ${sim.panel_power_w}W`} />
            <Row label="Surface" value={`~${surface} m²`} />
            <Row label="Conso annuelle" value={`${refConso.toLocaleString('fr-FR')} kWh`} />
            <Row label="Autoconsommation" value={`${calcs.selfConsumptionRate}%`} />
            <Row label="Équipements" value={`${(sim.appliances || []).length} équipements identifiés`} />
          </Section>
        </div>

        {sim.notes && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Observations</div>
            <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-md p-3 border border-slate-100">{sim.notes}</div>
          </div>
        )}
      </Card>

      {sim.id && (
        <Card className="bg-emerald-50/40 border-emerald-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-emerald-600 flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 text-sm">Rapport PDF</h3>
                <p className="text-xs text-emerald-700">Document professionnel téléchargeable</p>
              </div>
            </div>
            <button
              onClick={() => generatePDF(sim, calcs, profile)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-md font-semibold flex items-center gap-2 text-sm shadow-sm"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>
        </Card>
      )}

      <Card className="bg-emerald-50/40 border-emerald-200">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-emerald-100">
          <div className="w-9 h-9 rounded-md bg-emerald-600 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 text-sm">Impact environnemental</h3>
            <p className="text-xs text-emerald-700">Estimation sur la durée de vie de 25 ans</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-md p-3 border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">{calcs.co2Saved.toLocaleString('fr-FR')}</div>
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">kg CO₂ /an</div>
          </div>
          <div className="bg-white rounded-md p-3 border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">{(calcs.co2Saved * 25 / 1000).toFixed(1)} t</div>
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">CO₂ évité 25 ans</div>
          </div>
          <div className="bg-white rounded-md p-3 border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">{Math.round(calcs.co2Saved * 25 / 22)}</div>
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">arbres équiv.</div>
          </div>
        </div>
      </Card>

      <div className="text-center pt-2">
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          Établi par {profile.full_name} · Le {today} · Document à valeur indicative
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="py-2">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 pb-1.5 border-b border-slate-100">{title}</div>
      <dl className="space-y-0.5">{children}</dl>
    </div>
  );
}

function MiniStat({ label, value, unit, highlight }) {
  return (
    <div className={`rounded-md p-2.5 border ${highlight ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
      <div className={`text-[9px] font-bold uppercase tracking-widest ${highlight ? 'text-amber-400' : 'opacity-60'}`}>{label}</div>
      <div className={`text-base font-bold leading-tight mt-0.5 ${highlight ? 'text-amber-400' : ''}`}>{value}</div>
      {unit && <div className="text-[9px] opacity-50">{unit}</div>}
    </div>
  );
}

function BigStat({ icon: Icon, label, value, unit, accent }) {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200">
      <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-2 ${accent ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
      <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight mt-0.5">
        {value}
        {unit && <span className="text-xs ml-1 text-slate-500 font-medium">{unit}</span>}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 text-xs">
      <dt className="text-slate-500 font-semibold flex-shrink-0">{label}</dt>
      <dd className="text-slate-900 font-bold text-right">{value || '—'}</dd>
    </div>
  );
}
