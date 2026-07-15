import { useState } from 'react';

function UnitConverterPage() {
  const [activeTab, setActiveTab] = useState('length');
  const [value, setValue] = useState('');
  
  const converters = {
    length: {
      label: 'Length',
      units: { 'm': 1, 'cm': 0.01, 'mm': 0.001, 'km': 1000, 'mi': 1609.34, 'ft': 0.3048, 'in': 0.0254 },
    },
    weight: {
      label: 'Weight',
      units: { 'kg': 1, 'g': 0.001, 'mg': 0.000001, 'lb': 0.453592, 'oz': 0.0283495 },
    },
    data: {
      label: 'Data Size',
      units: { 'B': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776 },
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

  const initialUnits = Object.keys(converters[activeTab].units);
  const [fromUnit, setFromUnit] = useState(initialUnits[0]);
  const [toUnit, setToUnit] = useState(initialUnits[1] || initialUnits[0]);

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
        const baseUnitValue = baseValue * converter.units[fromUnit];
        conversions[unit] = baseUnitValue / converter.units[unit];
      });
    }

    return conversions;
  };

  const conversions = getConversions();
  const converter = converters[activeTab];
  const unitKeys = Object.keys(converter.units);

  return (
    <section className="space-y-8 text-slate-800 dark:text-slate-100">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Unit Converter</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Convert between various units of measurement (Length, Weight, Data, Temp, Volume)</p>
      </div>

      <div className="max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {/* Tab Selection */}
        <div className="flex gap-1 border-b border-slate-100 dark:border-slate-800 mb-6 flex-wrap">
          {Object.entries(converters).map(([key, conv]) => {
            const nextKeys = Object.keys(conv.units);
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setValue('');
                  setFromUnit(nextKeys[0]);
                  setToUnit(nextKeys[1] || nextKeys[0]);
                }}
                className={`px-5 py-3 font-semibold border-b-2 -mb-px transition ${
                  activeTab === key
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {conv.label}
              </button>
            );
          })}
        </div>

        {/* Conversion Inputs */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-750 dark:text-slate-300 mb-2">From</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-primary transition"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-3 outline-none focus:border-primary transition"
              >
                {unitKeys.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-750 dark:text-slate-300 mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-primary transition"
            >
              {unitKeys.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Conversion Result */}
        <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white text-center shadow-md">
          <p className="text-sm opacity-80">{value || '0'} {fromUnit} = </p>
          <p className="mt-2 text-3xl font-bold">{conversions[toUnit]?.toFixed(4) || '0'} {toUnit}</p>
        </div>

        {/* Side-by-side all other conversions */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">All Conversions (Reference)</h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
            {unitKeys.map((unit) => (
              <div
                key={unit}
                className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 p-4"
              >
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{unit}</p>
                <p className="mt-1.5 font-mono font-bold text-slate-850 dark:text-slate-200 text-lg">
                  {conversions[unit] >= 1000000 || (conversions[unit] > 0 && conversions[unit] < 0.0001)
                    ? conversions[unit].toExponential(4)
                    : conversions[unit]?.toFixed(4) || '0'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UnitConverterPage;
