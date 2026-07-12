import { FiBell, FiMoon, FiShield, FiSliders } from 'react-icons/fi';

const settingsSections = [
  {
    title: 'Theme',
    description: 'Switch the workspace between dark and light visual themes.',
    icon: FiMoon,
  },
  {
    title: 'Notifications',
    description: 'Control alerts for mission milestones and system warnings.',
    icon: FiBell,
  },
  {
    title: 'Profile',
    description: 'Manage operator preferences and mission roles.',
    icon: FiShield,
  },
  {
    title: 'API Configuration',
    description: 'Prepare the UI for future endpoints and service credentials.',
    icon: FiSliders,
  },
];

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-6 shadow-glow">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Tune the mission control workspace</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><Icon /></div>
                <div>
                  <p className="font-semibold text-white">{section.title}</p>
                  <p className="text-sm text-slate-400">{section.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
