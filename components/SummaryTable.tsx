import React from 'react';
import { CoffeeEntry } from '../types';
import { Button } from './UI';

interface SummaryTableProps {
  coffees: CoffeeEntry[];
  onBack: () => void;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ coffees, onBack }) => {
  
  const calculateScore = (c: CoffeeEntry) => 
    (c.fragranceScore + c.flavorScore + c.aftertasteScore + c.acidityScore + c.bodyScore + c.balanceScore) / 6;

  const exportCSV = () => {
    const headers = ['Café', 'Torréfaction', 'Fragrance', 'Saveur', 'Arrière-goût', 'Acidité', 'Corps', 'Équilibre', 'Score Final', 'Commentaires'];
    const rows = coffees.map(c => [
        `"${c.name}"`,
        c.roastLevel,
        c.fragranceScore,
        c.flavorScore,
        c.aftertasteScore,
        c.acidityScore,
        c.bodyScore,
        c.balanceScore,
        calculateScore(c).toFixed(2),
        `"${c.comments.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cupping_session_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fadeIn p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Récapitulatif de session</h2>
        <Button variant="outline" onClick={onBack}>Retour</Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 sticky left-0 bg-gray-50">Café</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Fragrance</th>
              <th className="px-4 py-3 text-center">Saveur</th>
              <th className="px-4 py-3 text-center">Arrière-goût</th>
              <th className="px-4 py-3 text-center">Acidité</th>
              <th className="px-4 py-3 text-center">Corps</th>
              <th className="px-4 py-3 text-center">Équilibre</th>
            </tr>
          </thead>
          <tbody>
            {coffees.map((c, idx) => (
              <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white whitespace-nowrap">
                    {c.name}
                </td>
                <td className="px-4 py-3 text-center font-bold text-primary">
                    {calculateScore(c).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">{c.fragranceScore}</td>
                <td className="px-4 py-3 text-center">{c.flavorScore}</td>
                <td className="px-4 py-3 text-center">{c.aftertasteScore}</td>
                <td className="px-4 py-3 text-center">{c.acidityScore}</td>
                <td className="px-4 py-3 text-center">{c.bodyScore}</td>
                <td className="px-4 py-3 text-center">{c.balanceScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={exportCSV} variant="secondary" className="w-full md:w-auto">
           📥 Exporter en CSV
        </Button>
      </div>
    </div>
  );
};

export default SummaryTable;