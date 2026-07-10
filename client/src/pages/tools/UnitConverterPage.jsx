import { useState } from 'react';

function UnitConverterPage() {
  const [activeTab, setActiveTab] = useState('length');
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');

  const converters = {
    length: {
      label: 'Length',
      units: { 'm': 1, 'cm': 0.01, 'mm': 0.001, 'km': 1000, 'mi': 1609.34, 'ft': 0.3048, 'in': 0.0254 },
    },
    weight: {
      label: 'Weight',
      units: { 'kg': 1, 'g': 0.001, 'mg': 0.000001, 'lb': 0.453592, 'oz': 0.0283495 },
    },
    temperature: {
      label: 'Temperature',
      units: { '°C': 'celsius', '°F': 'fahrenheit', 'K': 'kelvin' },
    },
    volume: {
      label: 'Volume',
      units: { 'L': 1, 'mL': 0.001, 'GAL': 3.78541, 'pint': 0.473176 },
    },
  };

  const getConversions = () => {
    const converter = converters[activeTab];
    const baseValue = parseFloat(value) || 0;
    const conversions = {};

    if (activeTab === 'temperature') {
      let celsius = baseValue;
      
      // Convert input to Celsius first
      if (fromUnit === '°F') {
        celsius = (baseValue - 32) * 5/9;
      } else if (fromUnit === 'K') {
        celsius = baseValue - 273.15;
      }
      
      // Convert from Celsius to target
      conversions['°C'] = celsius;
      conversions['°F'] = (celsius * 9/5) + 32;
      conversions['K'] = celsius + 273.15;
    } else {
      const units = Object.keys(converter.units);
      units.forEach((unit) => {
        // Convert to base unit first, then to target unit
        const metersBase = baseValue * converter.units[fromUnit];
        conversions[unit] = metersBase / converter.units[unit];
      });
    }

    return conversions;
  };

  const conversions = getConversions();

  const converter = converters[activeTab];
  const unitKeys = Object.keys(converter.units);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Unit Converter</h1>
        <p className="mt-2 text-slate-600">Convert between various units of measurement</p>
      </div>

      <div className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex gap-2 border-b border-slate-200 mb-6 flex-wrap">
          {Object.entries(converters).map(([key, conv]) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setValue(''); setFromUnit(unitKeys[0]); setToUnit(unitKeys[1] || unitKeys[0]); }}
              className={`px-4 py-2 font-semibold border-b-2 -mb-px transition ${
                activeTab === key ? 'border-primary text-primary' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {conv.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">From</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="rounded-2xl border border-slate-200 px-3 py-3 outline-none focus:border-primary"
              >
                {unitKeys.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
            >
              {unitKeys.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white text-center">
          <p className="text-sm opacity-80">{value || '0'} {fromUnit} = </p>
          <p className="mt-2 text-3xl font-bold">{conversions[toUnit]?.toFixed(4) || '0'} {toUnit}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-slate-900 mb-3">All Conversions</h3>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
            {unitKeys.map((unit) => (
              <div key={unit} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{unit}</p>
                <p className="mt-1 font-bold text-slate-900">{conversions[unit]?.toFixed(4) || '0'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UnitConverterPage;
