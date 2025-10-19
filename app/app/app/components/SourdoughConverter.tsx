'use client'

import React, { useState } from 'react';
import { ArrowRightLeft, Beaker, Clock, Thermometer, Info, Download, Copy, CheckCircle } from 'lucide-react';

const SourdoughYeastConverter = () => {
  const [conversionType, setConversionType] = useState('yeast-to-sourdough');
  const [starterHydration, setStarterHydration] = useState(100);
  const [starterPercentage, setStarterPercentage] = useState(18);
  const [roomTemp, setRoomTemp] = useState(75);
  
  const [recipeName, setRecipeName] = useState('');
  const [flourWeight, setFlourWeight] = useState('500');
  const [waterWeight, setWaterWeight] = useState('325');
  const [yeastWeight, setYeastWeight] = useState('7');
  const [sugarWeight, setSugarWeight] = useState('0');
  const [fatWeight, setFatWeight] = useState('0');
  const [saltWeight, setSaltWeight] = useState('10');
  const [otherIngredients, setOtherIngredients] = useState('');
  
  const [convertedRecipe, setConvertedRecipe] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const sampleRecipes = [
    { name: "Classic White Bread", flour: 500, water: 325, yeast: 7, sugar: 0, fat: 0, salt: 10, other: "" },
    { name: "Enriched Brioche", flour: 500, water: 180, yeast: 10, sugar: 50, fat: 125, salt: 10, other: "3 eggs (150g)" },
    { name: "Pizza Dough", flour: 500, water: 325, yeast: 5, sugar: 0, fat: 15, salt: 10, other: "" }
  ];

  const loadSample = (sample: any) => {
    setRecipeName(sample.name);
    setFlourWeight(sample.flour.toString());
    setWaterWeight(sample.water.toString());
    setYeastWeight(sample.yeast.toString());
    setSugarWeight(sample.sugar.toString());
    setFatWeight(sample.fat.toString());
    setSaltWeight(sample.salt.toString());
    setOtherIngredients(sample.other);
  };

  const convertRecipe = () => {
    const flour = parseFloat(flourWeight) || 0;
    const water = parseFloat(waterWeight) || 0;
    const yeast = parseFloat(yeastWeight) || 0;
    const sugar = parseFloat(sugarWeight) || 0;
    const fat = parseFloat(fatWeight) || 0;
    const salt = parseFloat(saltWeight) || 0;

    const isEnriched = sugar > 0 || fat > 0;
    const originalHydration = ((water / flour) * 100).toFixed(1);

    let converted: any = {};

    if (conversionType === 'yeast-to-sourdough') {
      const starterAmount = Math.round((flour * starterPercentage) / 100);
      const starterFlour = Math.round(starterAmount / (1 + (starterHydration / 100)));
      const starterWater = starterAmount - starterFlour;
      const adjustedFlour = flour - starterFlour;
      const adjustedWater = water - starterWater;

      let bulkTime = "4-6 hours";
      let finalProof = "2-3 hours (or overnight in fridge)";
      
      if (roomTemp >= 80) {
        bulkTime = "3-4 hours";
        finalProof = "1.5-2 hours";
      } else if (roomTemp <= 68) {
        bulkTime = "6-8 hours";
        finalProof = "3-4 hours";
      }

      converted = {
        name: recipeName || "Converted Sourdough Recipe",
        type: "Sourdough",
        isEnriched,
        ingredients: [
          { name: "Active sourdough starter", amount: starterAmount, unit: "g", note: `(${starterHydration}% hydration)` },
          { name: "Bread flour", amount: adjustedFlour, unit: "g" },
          { name: "Water", amount: adjustedWater, unit: "g" },
          { name: "Salt", amount: salt, unit: "g" },
          ...(sugar > 0 ? [{ name: "Sugar", amount: sugar, unit: "g" }] : []),
          ...(fat > 0 ? [{ name: "Butter/Fat", amount: fat, unit: "g" }] : []),
        ],
        process: [
          `Mix starter, water, and flour until combined. Autolyse 30 minutes.`,
          `Add salt${sugar > 0 ? ', sugar' : ''}${fat > 0 ? ', and butter' : ''}. Mix well.`,
          `Stretch and fold every 30 minutes for 2 hours.`,
          `Bulk ferment at ${roomTemp}°F for ${bulkTime}, until 50% increase.`,
          `Shape and place in banneton or pan.`,
          `Final proof: ${finalProof}`,
          `Bake at ${isEnriched ? '350°F' : '450°F'} ${isEnriched ? '35-40 min' : '20 min covered, 20-25 min uncovered'}.`
        ],
        timing: { bulk: bulkTime, finalProof: finalProof, total: "6-12 hours" },
        hydration: originalHydration,
        tips: [
          `Yeast ${yeast}g → Starter ${starterAmount}g (${starterPercentage}% of flour)`,
          `Maintains ${originalHydration}% hydration`,
          isEnriched ? `Enriched dough - consider sweet stiff starter` : `Lean dough - classic sourdough`,
          `At ${roomTemp}°F: ${roomTemp >= 80 ? 'Faster fermentation' : roomTemp <= 68 ? 'Slower, more flavor' : 'Moderate timing'}`,
          `Watch the dough, not the clock`
        ]
      };
    } else {
      const starterAmount = parseFloat(yeastWeight) || 100;
      const starterFlour = Math.round(starterAmount / (1 + (starterHydration / 100)));
      const starterWater = starterAmount - starterFlour;
      const adjustedFlour = flour + starterFlour;
      const adjustedWater = water + starterWater;
      const yeastAmount = Math.round((starterAmount / 100) * 7);

      converted = {
        name: recipeName || "Converted Yeast Recipe",
        type: "Yeast",
        isEnriched,
        ingredients: [
          { name: "Bread flour", amount: adjustedFlour, unit: "g" },
          { name: "Water", amount: adjustedWater, unit: "g" },
          { name: "Instant yeast", amount: yeastAmount, unit: "g", note: "(~2 tsp)" },
          { name: "Salt", amount: salt, unit: "g" },
          ...(sugar > 0 ? [{ name: "Sugar", amount: sugar, unit: "g" }] : []),
          ...(fat > 0 ? [{ name: "Butter/Fat", amount: fat, unit: "g" }] : []),
        ],
        process: [
          `Mix flour, water, and yeast. Rest 10 minutes.`,
          `Add salt${sugar > 0 ? ', sugar' : ''}${fat > 0 ? ', and butter' : ''}. Knead 8-10 minutes.`,
          `First rise: 1-2 hours until doubled.`,
          `Shape and place in pan.`,
          `Second rise: 45-60 minutes until puffy.`,
          `Bake at ${isEnriched ? '350°F' : '450°F'} for ${isEnriched ? '30-35 min' : '25-30 min'}.`
        ],
        timing: { firstRise: "1-2 hours", secondRise: "45-60 min", total: "2.5-3.5 hours" },
        hydration: originalHydration,
        tips: [
          `Starter ${starterAmount}g → Yeast ${yeastAmount}g`,
          `Maintains ${originalHydration}% hydration`,
          `Much faster: 3 hours vs 8-12 hours`,
          `Less complex flavor than sourdough`,
          `Use 1/4 tsp yeast for slower, more flavorful rise`
        ]
      };
    }

    setConvertedRecipe(converted);
  };

  const downloadRecipe = () => {
    if (!convertedRecipe) return;
    const text = `${convertedRecipe.name}\n\nIngredients:\n${convertedRecipe.ingredients.map((ing: any) => `${ing.amount}g ${ing.name}`).join('\n')}\n\nProcess:\n${convertedRecipe.process.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}\n\n© 2025 Vitale Sourdough Co.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recipe.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!convertedRecipe) return;
    const text = `${convertedRecipe.name}\n\n${convertedRecipe.ingredients.map((ing: any) => `${ing.amount}g ${ing.name}`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-amber-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Sourdough ↔ Yeast Converter</h1>
          <p className="text-amber-200 text-sm">Convert recipes between sourdough and commercial yeast</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Smart Recipe Conversion</h2>
          <p className="text-gray-600 mb-2">
            Convert any bread recipe with intelligent adjustments for hydration, timing, and technique.
          </p>
          <p className="text-sm text-gray-500 italic">
            By Baking Great Bread at Home and Henry Hunter • © 2025 Vitale Sourdough Co.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recipe Input</h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Try a Sample:</label>
                <div className="grid grid-cols-1 gap-2">
                  {sampleRecipes.map((recipe, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadSample(recipe)}
                      className="text-left p-3 rounded-lg border-2 border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition text-sm font-medium"
                    >
                      <Beaker className="w-4 h-4 inline mr-2" />
                      {recipe.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Conversion:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConversionType('yeast-to-sourdough')}
                    className={`p-3 rounded-lg border-2 font-medium transition ${
                      conversionType === 'yeast-to-sourdough'
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-gray-300'
                    }`}
                  >
                    Yeast → Sourdough
                  </button>
                  <button
                    onClick={() => setConversionType('sourdough-to-yeast')}
                    className={`p-3 rounded-lg border-2 font-medium transition ${
                      conversionType === 'sourdough-to-yeast'
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-gray-300'
                    }`}
                  >
                    Sourdough → Yeast
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Recipe Name"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Flour (g):</label>
                  <input type="number" value={flourWeight} onChange={(e) => setFlourWeight(e.target.value)} className="w-full p-3 border-2 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Water (g):</label>
                  <input type="number" value={waterWeight} onChange={(e) => setWaterWeight(e.target.value)} className="w-full p-3 border-2 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{conversionType === 'yeast-to-sourdough' ? 'Yeast (g)' : 'Starter (g)'}:</label>
                  <input type="number" value={yeastWeight} onChange={(e) => setYeastWeight(e.target.value)} className="w-full p-3 border-2 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
