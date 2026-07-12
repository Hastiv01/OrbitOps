import { FiGlobe, FiRadio, FiWifi, FiClock } from 'react-icons/fi';
import CommunicationWindowCard from '../components/CommunicationWindow/CommunicationWindowCard';
import PayloadCard from '../components/PayloadCard/PayloadCard';
import { communicationWindows, groundStations, payloads } from '../data/dummyData';

const SatelliteOperations = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Communication Windows', value: '12', icon: FiRadio },
          { label: 'Ground Stations', value: '3', icon: FiGlobe },
          { label: 'Orbit Coverage', value: '94%', icon: FiWifi },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{item.label}</p>
                <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300"><Icon /></div>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold text-white">Communication Windows</p>
            <span className="text-sm text-slate-400">Today</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {communicationWindows.map((window) => (
              <CommunicationWindowCard key={window.id} window={window} />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold text-white">Ground Stations</p>
            <span className="text-sm text-slate-400">Operational</span>
          </div>
          <div className="space-y-3">
            {groundStations.map((station) => (
              <div key={station.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{station.name}</p>
                  <span className="text-xs text-slate-400">{station.availability}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{station.location}</p>
                <p className="mt-1 text-sm text-slate-400">Latency {station.latency} • {station.capacity} capacity</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold text-white">Payload Schedule</p>
            <span className="text-sm text-slate-400">Next 6 hours</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {payloads.map((payload) => (
              <PayloadCard key={payload.id} payload={payload} />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold text-white">Visibility Timeline</p>
            <div className="rounded-full bg-sky-500/15 p-2 text-sky-300"><FiClock /></div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Astra-7', time: '08:00 - 08:20' },
              { label: 'Nova-2', time: '11:15 - 11:40' },
              { label: 'Orion-4', time: '15:35 - 16:00' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="font-medium text-white">{item.label}</span>
                <span className="text-sm text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteOperations;
