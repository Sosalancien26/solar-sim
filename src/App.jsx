import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sun, Plus, Trash2, Save, FileText, Search, ChevronRight, ChevronLeft, Home, Zap, Settings, CheckCircle, X, Edit, Calculator, TrendingUp, Loader2, MapPin, Sparkles, Target, Gauge, Compass, BarChart3, Leaf, Phone, Mail, User, Award, Flame, Activity } from 'lucide-react';

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

const ORIENTATION_COEF = {
  'Sud': 1.0, 'Sud-Est': 0.95, 'Sud-Ouest': 0.95,
  'Est': 0.85, 'Ouest': 0.85, 'Nord': 0.6,
};

// Paliers commerciaux standards (biais sur 3.5/4/4.5)
const KWC_TIERS = [3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

const APPLIANCE_CATEGORIES = [
  {
    id: 'cuisine', label: 'Cuisine', emoji: '🍳',
    items: [
      { name: 'Réfrigérateur', power: 150, hours: 24, kwh_year: 350, emoji: '🧊' },
      { name: 'Congélateur', power: 100, hours: 24, kwh_year: 300, emoji: '❄️' },
      { name: 'Lave-vaisselle', power: 1500, hours: 1, kwh_year: 250, emoji: '🍽️' },
      { name: 'Four électrique', power: 2500, hours: 0.5, kwh_year: 150, emoji: '🔥' },
      { name: 'Plaques cuisson', power: 3000, hours: 0.5, kwh_year: 200, emoji: '🍳' },
      { name: 'Micro-ondes', power: 1000, hours: 0.25, kwh_year: 50, emoji: '📡' },
      { name: 'Cafetière', power: 1200, hours: 0.25, kwh_year: 80, emoji: '☕' },
      { name: 'Bouilloire', power: 2000, hours: 0.1, kwh_year: 60, emoji: '🫖' },
    ]
  },
  {
    id: 'lavage', label: 'Buanderie', emoji: '🧺',
    items: [
      { name: 'Lave-linge', power: 2000, hours: 1, kwh_year: 200, emoji: '👕' },
      { name: 'Sèche-linge', power: 2500, hours: 1, kwh_year: 350, emoji: '🌀' },
      { name: 'Fer à repasser', power: 2000, hours: 0.2, kwh_year: 60, emoji: '👔' },
    ]
  },
  {
    id: 'multimedia', label: 'Multimédia', emoji: '📺',
    items: [
      { name: 'Télévision', power: 150, hours: 5, kwh_year: 270, emoji: '📺' },
      { name: 'Box internet', power: 20, hours: 24, kwh_year: 175, emoji: '📡' },
      { name: 'Ordinateur', power: 200, hours: 4, kwh_year: 290, emoji: '💻' },
      { name: 'Console de jeu', power: 200, hours: 2, kwh_year: 150, emoji: '🎮' },
      { name: 'Home cinéma', power: 300, hours: 3, kwh_year: 330, emoji: '🎬' },
    ]
  },
  {
    id: 'chauffage', label: 'Chauffage / Clim', emoji: '🔥',
    items: [
      { name: 'Chauffage électrique', power: 2000, hours: 6, kwh_year: 5000, emoji: '🔥' },
      { name: 'Pompe à chaleur', power: 3000, hours: 8, kwh_year: 4500, emoji: '🌬️' },
      { name: 'Climatisation', power: 2000, hours: 4, kwh_year: 1500, emoji: '❄️' },
      { name: "Radiateur d'appoint", power: 1500, hours: 3, kwh_year: 800, emoji: '🌡️' },
    ]
  },
  {
    id: 'eau', label: 'Eau chaude', emoji: '💧',
    items: [
      { name: 'Ballon eau chaude', power: 2000, hours: 4, kwh_year: 2500, emoji: '🚿' },
      { name: 'Ballon thermodynamique', power: 800, hours: 4, kwh_year: 1200, emoji: '♨️' },
    ]
  },
  {
    id: 'mobilite', label: 'Mobilité', emoji: '🚗',
    items: [
      { name: 'Voiture électrique', power: 7400, hours: 2, kwh_year: 3000, emoji: '🚗' },
      { name: 'Borne recharge VE', power: 11000, hours: 1.5, kwh_year: 3500, emoji: '🔌' },
      { name: 'Vélo électrique', power: 250, hours: 2, kwh_year: 50, emoji: '🚲' },
    ]
  },
  {
    id: 'piscine', label: 'Piscine / Spa', emoji: '🏊',
    items: [
      { name: 'Pompe filtration', power: 750, hours: 8, kwh_year: 2200, emoji: '💦' },
      { name: 'Piscine chauffée', power: 3000, hours: 6, kwh_year: 4500, emoji: '🏊' },
      { name: 'Spa / Jacuzzi', power: 3000, hours: 2, kwh_year: 2500, emoji: '🛁' },
    ]
  },
  {
    id: 'autre', label: 'Autres', emoji: '✨',
    items: [
      { name: 'Éclairage LED', power: 100, hours: 5, kwh_year: 180, emoji: '💡' },
      { name: 'Aspirateur', power: 1500, hours: 0.2, kwh_year: 50, emoji: '🧹' },
      { name: 'Sèche-cheveux', power: 1500, hours: 0.1, kwh_year: 30, emoji: '💇' },
    ]
  },
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

export default function SolarSimulator() {
  const [view, setView] = useState('list');
  const [simulations, setSimulations] = useState([]);
  const [currentSim, setCurrentSim] = useState(initialSim);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [overrideMode, setOverrideMode] = useState(false);

  useEffect(() => { loadSimulations(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const loadSimulations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/solar_simulations?select=*&order=updated_at.desc`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      });
      const data = await res.json();
      setSimulations(Array.isArray(data) ? data : []);
    } catch (e) { showToast('Erreur de chargement', 'error'); }
    setLoading(false);
  };

  const saveSimulation = async () => {
    if (!currentSim.client_name?.trim()) {
      showToast('Le nom du client est requis', 'error');
      setStep(1); return;
    }
    setSaving(true);
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
      };
      const isUpdate = !!currentSim.id;
      const url = isUpdate
        ? `${SUPABASE_URL}/rest/v1/solar_simulations?id=eq.${currentSim.id}`
        : `${SUPABASE_URL}/rest/v1/solar_simulations`;
      const res = await fetch(url, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: {
          'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json', 'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const saved = Array.isArray(data) ? data[0] : data;
      setCurrentSim({ ...saved, appliances: saved.appliances || [] });
      showToast(isUpdate ? 'Simulation mise à jour' : 'Simulation enregistrée');
      await loadSimulations();
    } catch (e) {
      console.error(e);
      showToast("Erreur d'enregistrement", 'error');
    }
    setSaving(false);
  };

  const deleteSimulation = async (id) => {
    if (!confirm('Supprimer cette simulation ?')) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/solar_simulations?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      });
      showToast('Simulation supprimée');
      await loadSimulations();
    } catch (e) { showToast('Erreur de suppression', 'error'); }
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

  const updateSim = (patch) => setCurrentSim(prev => ({ ...prev, ...patch }));
  const calcs = useMemo(() => computeAll(currentSim), [currentSim]);

  const filteredSims = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return simulations;
    return simulations.filter(s =>
      s.client_name?.toLowerCase().includes(q) ||
      s.client_city?.toLowerCase().includes(q) ||
      s.client_postal_code?.includes(q)
    );
  }, [simulations, searchQuery]);

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-slate-100">
        <Toast toast={toast} />
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none tracking-tight">SOLAR SIM</h1>
                <p className="text-[11px] text-slate-500 leading-none mt-1 font-medium uppercase tracking-wider">Études photovoltaïques</p>
              </div>
            </div>
            <button
              onClick={newSimulation}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-all text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvelle étude</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {simulations.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatBubble label="Études" value={simulations.length} icon={FileText} />
              <StatBubble label="Validées" value={simulations.filter(s => s.status === 'validé' || s.status === 'signé').length} icon={CheckCircle} accent />
              <StatBubble label="Total kWc" value={simulations.reduce((s, x) => s + (Number(x.final_kwc) || 0), 0).toFixed(1)} icon={Zap} />
            </div>
          )}

          <div className="mb-5 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un client, ville, code postal..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-slate-700" />
            </div>
          ) : filteredSims.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-slate-200">
              <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center">
                <Sun className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {searchQuery ? 'Aucun résultat' : 'Aucune étude'}
              </h3>
              <p className="text-slate-500 mb-6 text-sm">
                {searchQuery ? 'Essayez une autre recherche' : 'Démarrez votre première étude photovoltaïque'}
              </p>
              {!searchQuery && (
                <button onClick={newSimulation}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-md font-semibold inline-flex items-center gap-2 transition-all text-sm shadow-sm">
                  <Plus className="w-4 h-4" />
                  Nouvelle étude
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSims.map(sim => (
                <SimCard key={sim.id} sim={sim} onOpen={() => openSimulation(sim)} onDelete={() => deleteSimulation(sim.id)} />
              ))}
            </div>
          )}
        </main>

        <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400">
          Solar Sim · Outil professionnel d'étude photovoltaïque
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-32">
      <Toast toast={toast} />
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-3">
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
            <button onClick={saveSimulation} disabled={saving}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-md font-semibold flex items-center gap-1.5 transition-all disabled:opacity-60 text-sm shadow-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">Enregistrer</span>
            </button>
          </div>

          <div className="relative pt-2">
            <div className="absolute top-[18px] left-4 right-4 h-0.5 bg-slate-200">
              <div className="h-full bg-slate-900 transition-all duration-500"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
            </div>
            <div className="relative flex items-start justify-between">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isDone = step > s.id;
                return (
                  <button key={s.id} onClick={() => setStep(s.id)}
                    className="flex flex-col items-center gap-1.5 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-slate-900 text-amber-400 ring-4 ring-amber-100'
                        : isDone
                        ? 'bg-slate-900 text-white'
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
        {step === 1 && <StepClient sim={currentSim} update={updateSim} showToast={showToast} />}
        {step === 2 && <StepHousing sim={currentSim} update={updateSim} />}
        {step === 3 && <StepAppliances sim={currentSim} update={updateSim} />}
        {step === 4 && <StepConsumption sim={currentSim} update={updateSim} calcs={calcs} />}
        {step === 5 && <StepSizing sim={currentSim} update={updateSim} calcs={calcs} overrideMode={overrideMode} setOverrideMode={setOverrideMode} />}
        {step === 6 && <StepRecap sim={currentSim} calcs={calcs} />}

        <div className="flex items-center justify-between mt-8 gap-3">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-all flex items-center gap-1.5 text-sm">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Précédent</span>
          </button>
          {step < STEPS.length ? (
            <button onClick={() => setStep(Math.min(STEPS.length, step + 1))}
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

function numOrNull(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v); return isNaN(n) ? null : n;
}
function intOrNull(v) {
  const n = numOrNull(v); return n === null ? null : Math.round(n);
}

// Choisit le palier kWc commercial le plus pertinent
function selectCommercialKwc(rawKwc) {
  // Borné entre 3.5 et 9
  if (rawKwc <= 3.5) return 3.5;
  if (rawKwc >= 9) return 9.0;

  // On cherche le palier supérieur ou égal (fourchette haute)
  for (const tier of KWC_TIERS) {
    if (rawKwc <= tier) return tier;
  }
  return 9.0;
}

function computeAll(sim) {
  const apps = sim.appliances || [];
  const estimatedConsumption = apps.reduce((sum, a) => {
    const kwh = (Number(a.power) * Number(a.hours) * (Number(a.days_per_week) || 7) * 52) / 1000;
    return sum + (isNaN(kwh) ? 0 : kwh);
  }, 0);

  const refConsumption = numOrNull(sim.annual_consumption_kwh) || estimatedConsumption || 0;

  const sunshine = REGIONS[sim.region] || 1100;
  const orientCoef = ORIENTATION_COEF[sim.roof_orientation] || 1;
  const incl = Number(sim.roof_inclination) || 30;
  const inclCoef = incl >= 20 && incl <= 45 ? 1 : 0.95;
  const productionPerKwc = sunshine * orientCoef * inclCoef;

  // Calcul brut : on vise une couverture qui donne souvent 3.5/4/4.5 kWc
  // Pour une conso modérée (≤ 5500 kWh) → on tape 3.5-4.5 kWc
  // Pour une conso plus élevée → on monte progressivement jusqu'à 9 max
  let rawKwc;
  if (refConsumption <= 0) {
    rawKwc = 3.5;
  } else if (refConsumption <= 4000) {
    rawKwc = 3.5;
  } else if (refConsumption <= 5000) {
    rawKwc = 4.0;
  } else if (refConsumption <= 6000) {
    rawKwc = 4.5;
  } else {
    // Au-delà : ratio classique mais borné
    rawKwc = (refConsumption * 0.85 / productionPerKwc);
  }

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

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-xl text-white font-semibold flex items-center gap-2 text-sm ${
      toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'
    }`}>
      {toast.type === 'error' ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4 text-amber-400" />}
      {toast.msg}
    </div>
  );
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

function SimCard({ sim, onOpen, onDelete }) {
  const statusConfig = {
    'brouillon': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
    'validé': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    'signé': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'annulé': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  };
  const cfg = statusConfig[sim.status] || statusConfig.brouillon;

  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 truncate">{sim.client_name || 'Sans nom'}</h3>
          <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {sim.client_city || sim.client_postal_code || sim.region || '—'}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text} flex items-center gap-1.5 flex-shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {sim.status || 'brouillon'}
        </span>
      </div>

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
}

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

function Field({ label, children, className = '', hint }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-widest">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function Input(props) {
  const { className, ...rest } = props;
  return (
    <input {...rest}
      className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm ${className || ''}`}
    />
  );
}

function Select({ children, className, ...rest }) {
  return (
    <select {...rest}
      className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all appearance-none text-slate-900 text-sm ${className || ''}`}
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%2364748b%27 d=%27M3 4l3 3 3-3z%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }}
    >
      {children}
    </select>
  );
}

function StepClient({ sim, update, showToast }) {
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const debounceRef = useRef(null);

  const searchAddress = (query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 3) {
      setSuggestions([]); setShowSuggest(false); return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setSuggestions(data.features || []);
        setShowSuggest(true);
      } catch (e) {
        setSuggestions([]);
      }
      setSearching(false);
    }, 300);
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
    update({
      client_address: p.name || '',
      client_postal_code: postal,
      client_city: p.city || '',
      region,
    });
    setShowSuggest(false);
    setSuggestions([]);
    showToast(`Adresse trouvée • ${region}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader icon={User} title="Informations client" subtitle="Coordonnées du prospect" num="01" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nom complet *" className="sm:col-span-2">
            <Input value={sim.client_name} onChange={e => update({ client_name: e.target.value })} placeholder="Jean Dupont" />
          </Field>
          <Field label="Téléphone">
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={sim.client_phone} onChange={e => update({ client_phone: e.target.value })} placeholder="06 12 34 56 78" className="pl-9" />
            </div>
          </Field>
          <Field label="Email">
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={sim.client_email} onChange={e => update({ client_email: e.target.value })} placeholder="email@exemple.fr" type="email" className="pl-9" />
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
                type="text"
                value={sim.client_address || ''}
                onChange={e => {
                  update({ client_address: e.target.value });
                  searchAddress(e.target.value);
                }}
                onFocus={() => sim.client_address && searchAddress(sim.client_address)}
                onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
                placeholder="Tapez l'adresse complète..."
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm"
              />
              {searching && <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-500" />}

              {showSuggest && suggestions.length > 0 && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={e => { e.preventDefault(); selectAddress(s); }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors flex items-start gap-2.5"
                    >
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-900 truncate">{s.properties.name}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {s.properties.postcode} {s.properties.city}
                          {s.properties.context && <span className="text-slate-400"> · {s.properties.context}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Code postal">
              <Input value={sim.client_postal_code || ''} onChange={e => {
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

function StepHousing({ sim, update }) {
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
                  className={`py-2.5 rounded-md font-semibold text-sm transition-all ${
                    sim.housing_type === t
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Surface habitable (m²)">
            <Input type="number" value={sim.surface_m2} onChange={e => update({ surface_m2: e.target.value })} placeholder="120" />
          </Field>
          <Field label="Nombre d'occupants">
            <div className="flex items-center gap-2">
              <button onClick={() => update({ occupants: Math.max(1, (Number(sim.occupants) || 1) - 1) })}
                className="w-10 h-10 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-lg text-slate-700">−</button>
              <Input type="number" value={sim.occupants} onChange={e => update({ occupants: e.target.value })} placeholder="4" className="text-center font-bold" />
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
                className={`p-2.5 rounded-md border transition-all ${
                  sim.roof_orientation === o.val
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white hover:border-slate-400'
                }`}>
                <div className="text-lg mb-0.5">{o.emoji}</div>
                <div className={`text-[10px] font-bold ${sim.roof_orientation === o.val ? 'text-white' : 'text-slate-700'}`}>{o.val}</div>
                <div className={`text-[9px] font-bold mt-0.5 ${
                  sim.roof_orientation === o.val
                    ? 'text-amber-400'
                    : o.score >= 95 ? 'text-emerald-600' : o.score >= 85 ? 'text-amber-600' : 'text-red-500'
                }`}>{o.score}%</div>
              </button>
            ))}
          </div>
        </Field>
        <Field label={`Inclinaison : ${sim.roof_inclination}°`} className="mt-4">
          <input
            type="range" min="0" max="60" value={sim.roof_inclination}
            onChange={e => update({ roof_inclination: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>0° (plat)</span>
            <span className={sim.roof_inclination >= 20 && sim.roof_inclination <= 45 ? 'text-emerald-600 font-bold' : ''}>
              30° optimal
            </span>
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

  const getQuantity = (name) => apps.filter(a => a.name === name).length;
  const isSelected = (name) => getQuantity(name) > 0;

  const toggleAppliance = (item) => {
    if (isSelected(item.name)) {
      const idx = apps.findIndex(a => a.name === item.name);
      const newApps = [...apps];
      newApps.splice(idx, 1);
      update({ appliances: newApps });
    } else {
      update({
        appliances: [...apps, {
          id: Date.now() + Math.random(),
          name: item.name,
          power: item.power,
          hours: item.hours,
          days_per_week: 7,
          emoji: item.emoji,
        }]
      });
    }
  };

  const addInstance = (item) => {
    update({
      appliances: [...apps, {
        id: Date.now() + Math.random(),
        name: item.name,
        power: item.power,
        hours: item.hours,
        days_per_week: 7,
        emoji: item.emoji,
      }]
    });
  };

  const removeOne = (name) => {
    const idx = apps.findIndex(a => a.name === name);
    if (idx === -1) return;
    const newApps = [...apps];
    newApps.splice(idx, 1);
    update({ appliances: newApps });
  };

  const total = apps.reduce((sum, a) => sum + ((Number(a.power) * Number(a.hours) * (Number(a.days_per_week) || 7) * 52) / 1000), 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader icon={Zap} title="Inventaire des équipements" subtitle="Sélectionnez les appareils du logement" num="06" />

        <div className="bg-slate-900 rounded-md p-4 text-white mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Conso estimée</div>
            <div className="text-2xl font-bold mt-0.5">
              {Math.round(total).toLocaleString('fr-FR')}
              <span className="text-sm font-medium opacity-70 ml-1">kWh/an</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Équipements</div>
            <div className="text-2xl font-bold text-amber-400 mt-0.5">{apps.length}</div>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 mb-4">
          {APPLIANCE_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {APPLIANCE_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item, i) => {
            const selected = isSelected(item.name);
            const qty = getQuantity(item.name);
            return (
              <button key={i} onClick={() => toggleAppliance(item)}
                className={`relative p-3 rounded-md border transition-all text-left ${
                  selected
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 bg-white hover:border-slate-400'
                }`}>
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                )}
                <div className="text-3xl mb-1.5">{item.emoji}</div>
                <div className="text-xs font-bold text-slate-900 mb-0.5 leading-tight">{item.name}</div>
                <div className="text-[10px] text-slate-500">{item.power}W · {item.kwh_year} kWh/an</div>
                {qty > 1 && (
                  <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                    ×{qty}
                  </div>
                )}
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
              const kwh = Math.round((Number(a.power) * Number(a.hours) * (Number(a.days_per_week) || 7) * 52) / 1000);
              return (
                <div key={a.id} className="bg-slate-50 rounded-md p-3 border border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-2xl">{a.emoji || '⚡'}</span>
                      <div className="font-bold text-slate-900 truncate text-sm">{a.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded whitespace-nowrap">
                        {kwh} kWh/an
                      </span>
                      <button onClick={() => update({ appliances: apps.filter(x => x.id !== a.id) })}
                        className="text-slate-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Watts</label>
                      <input type="number" value={a.power}
                        onChange={e => update({ appliances: apps.map(x => x.id === a.id ? { ...x, power: Number(e.target.value) } : x) })}
                        className="w-full px-2 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">H/jour</label>
                      <input type="number" step="0.25" value={a.hours}
                        onChange={e => update({ appliances: apps.map(x => x.id === a.id ? { ...x, hours: Number(e.target.value) } : x) })}
                        className="w-full px-2 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">J/sem</label>
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
            <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
              diffPct < 25 ? 'bg-emerald-600' : 'bg-amber-600'
            }`}>
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
        <div className={`h-full rounded-full transition-all duration-500 ${dark ? 'bg-slate-900' : 'bg-amber-500'}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StepSizing({ sim, update, calcs, overrideMode, setOverrideMode }) {
  const coverage = calcs.refConsumption > 0 ? Math.round((calcs.production / calcs.refConsumption) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-lg p-5 sm:p-6 text-white border border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="font-bold text-sm uppercase tracking-widest">Préconisation technique</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Puissance</div>
            <div className="text-4xl font-bold text-amber-400">
              {calcs.recommendedKwc}
              <span className="text-base ml-1 text-white/60 font-medium">kWc</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Panneaux</div>
            <div className="text-4xl font-bold text-amber-400">
              {calcs.recommendedPanels}
              <span className="text-base ml-1 text-white/60 font-medium">u.</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="opacity-60 font-bold uppercase tracking-wider text-[10px]">Production</div>
            <div className="font-bold text-white mt-0.5">{calcs.production.toLocaleString('fr-FR')} kWh</div>
          </div>
          <div>
            <div className="opacity-60 font-bold uppercase tracking-wider text-[10px]">Couverture</div>
            <div className="font-bold text-white mt-0.5">{coverage}%</div>
          </div>
          <div>
            <div className="opacity-60 font-bold uppercase tracking-wider text-[10px]">Autoconso</div>
            <div className="font-bold text-amber-400 mt-0.5">{calcs.selfConsumptionRate}%</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader icon={Settings} title="Configuration des panneaux" subtitle="Puissance unitaire des modules" num="08" />
        <Field label="Puissance par panneau">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PANEL_OPTIONS.map(p => (
              <button key={p}
                onClick={() => update({ panel_power_w: p, final_panels: null })}
                className={`py-2.5 rounded-md font-bold text-sm transition-all ${
                  sim.panel_power_w === p
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}>
                {p}W
              </button>
            ))}
          </div>
        </Field>
      </Card>

      <Card className={overrideMode ? 'border-amber-200 bg-amber-50/30' : ''}>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center ${
              overrideMode ? 'bg-amber-500' : 'bg-slate-200'
            }`}>
              <Target className={`w-4 h-4 ${overrideMode ? 'text-white' : 'text-slate-500'}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Ajustement manuel</h3>
              <p className="text-xs text-slate-500">Fixer la puissance commerciale finale</p>
            </div>
          </div>
          <button onClick={() => {
            if (overrideMode) update({ final_kwc: null, final_panels: null });
            setOverrideMode(!overrideMode);
          }}
            className={`relative w-11 h-6 rounded-full transition-colors ${overrideMode ? 'bg-slate-900' : 'bg-slate-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${overrideMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {overrideMode && (
          <>
            <Field label="Sélection rapide" className="mb-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {KWC_TIERS.map(k => (
                  <button key={k}
                    onClick={() => {
                      const panels = Math.ceil((k * 1000) / sim.panel_power_w);
                      update({ final_kwc: k, final_panels: panels });
                    }}
                    className={`py-2 rounded-md font-bold text-sm transition-all ${
                      sim.final_kwc === k
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}>
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
                className={`py-2.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${
                  sim.status === s
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </Field>
      </Card>
    </div>
  );
}

function StepRecap({ sim, calcs }) {
  const finalKwc = sim.final_kwc ?? calcs.recommendedKwc;
  const finalPanels = sim.final_panels ?? calcs.recommendedPanels;
  const finalProd = Math.round(finalKwc * calcs.productionPerKwc);
  const refConso = numOrNull(sim.annual_consumption_kwh) || calcs.estimatedConsumption;
  const surface = Math.round(finalPanels * 1.95);
  const coverageRate = refConso > 0 ? Math.min(999, Math.round((finalProd / refConso) * 100)) : 0;
  const selfConsumed = Math.round(finalProd * (calcs.selfConsumptionRate / 100));
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Hero card */}
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
              <div className="text-3xl font-bold text-amber-400">
                {finalKwc}
                <span className="text-base ml-1 text-white/60 font-medium">kWc</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-md p-4 border border-white/10">
              <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Panneaux</div>
              <div className="text-3xl font-bold text-amber-400">
                {finalPanels}
                <span className="text-base ml-1 text-white/60 font-medium">×{sim.panel_power_w}W</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <MiniStat label="Production" value={finalProd.toLocaleString('fr-FR')} unit="kWh/an" />
            <MiniStat label="Autoconso" value={`${calcs.selfConsumptionRate}%`} highlight />
            <MiniStat label="Couverture" value={`${coverageRate}%`} />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <BigStat icon={TrendingUp} label="Autoconso" value={`${calcs.selfConsumptionRate}%`} accent />
        <BigStat icon={Activity} label="Autoconsommé" value={selfConsumed.toLocaleString('fr-FR')} unit="kWh" />
        <BigStat icon={Gauge} label="Couverture" value={`${coverageRate}%`} />
        <BigStat icon={Home} label="Surface" value={surface} unit="m²" />
      </div>

      {/* Détails techniques */}
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
            <Row label="Surface panneaux" value={`~${surface} m²`} />
            <Row label="Production estimée" value={`${finalProd.toLocaleString('fr-FR')} kWh/an`} />
            <Row label="Conso annuelle" value={`${refConso.toLocaleString('fr-FR')} kWh`} />
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

      {/* Impact environnemental */}
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

      {/* Footer document */}
      <div className="text-center pt-2">
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          Étude établie le {today} · Document à valeur indicative
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
