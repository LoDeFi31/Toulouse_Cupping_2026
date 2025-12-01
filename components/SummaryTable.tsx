import React from 'react';
import { CoffeeEntry } from '../types';
import { Button } from './UI';
import { HeartFilledIcon, PrinterIcon } from './Icons';

interface SummaryTableProps {
  coffees: CoffeeEntry[];
  onBack: () => void;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ coffees, onBack }) => {
  
  const calculateScore = (c: CoffeeEntry) => 
    (c.fragranceScore + c.flavorScore + c.aftertasteScore + c.acidityScore + c.bodyScore + c.balanceScore) / 6;

  const exportCSV = () => {
    const headers = ['Café', 'Favori', 'Fragrance', 'Saveur', 'Arrière-goût', 'Acidité', 'Corps', 'Équilibre', 'Score Final', 'Commentaires'];
    const rows = coffees.map(c => [
        `"${c.name}"`,
        c.isFavorite ? 'Oui' : 'Non',
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

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = () => {
    // Access jsPDF from global window object (loaded via CDN)
    const win = window as any;
    if (!win.jspdf) {
      alert("La librairie PDF n'est pas encore chargée. Utilisation de l'impression standard.");
      window.print();
      return;
    }

    const { jsPDF } = win.jspdf;
    const doc = new jsPDF();

    // -- Header --
    doc.setFontSize(22);
    doc.setTextColor(141, 110, 77); // #8D6E4D (Primary Brown)
    doc.text("Rapport de Dégustation", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Toulouse Cupping App - Date: ${new Date().toLocaleDateString()}`, 14, 28);

    // -- Table Data --
    const tableColumn = ["Café", "Fav", "Score", "Fragrance", "Saveur", "Ar.-Goût", "Acidité", "Corps", "Équilibre"];
    const tableRows: any[] = [];

    coffees.forEach(coffee => {
      const coffeeData = [
        coffee.name,
        coffee.isFavorite ? "♥" : "-",
        calculateScore(coffee).toFixed(2),
        coffee.fragranceScore,
        coffee.flavorScore,
        coffee.aftertasteScore,
        coffee.acidityScore,
        coffee.bodyScore,
        coffee.balanceScore
      ];
      tableRows.push(coffeeData);
    });

    // -- Table Render --
    // Check if autoTable plugin is available
    if ((doc as any).autoTable) {
        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'striped',
            headStyles: { 
                fillColor: [141, 110, 77], // Primary Color
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 'auto' }, // Name
                1: { halign: 'center', textColor: [220, 50, 50] }, // Favorite Heart
                2: { fontStyle: 'bold', halign: 'center' } // Score
            }
        });
    }

    // -- Footer --
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Page ' + i + ' sur ' + pageCount, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
    }

    doc.save(`cupping_rapport_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="animate-fadeIn p-4 pb-20 max-w-5xl mx-auto" id="printable-area">
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-headline-small font-bold text-primary dark:text-primary-dark">Récapitulatif de session</h2>
        <Button variant="outlined" onClick={onBack}>Retour</Button>
      </div>

      <div className="mb-4 print-only hidden">
          <h1 className="text-3xl font-bold text-black mb-2">Rapport de Dégustation</h1>
          <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-surface-container-dark rounded-xl shadow-md border border-outline/10">
        <table className="w-full text-body-medium text-left text-on-surface-variant dark:text-on-surface-variant-dark">
          <thead className="text-label-medium uppercase bg-surface-container-high dark:bg-surface-container-high-dark border-b border-outline/10 text-on-surface dark:text-on-surface-dark">
            <tr>
              <th className="px-4 py-3 sticky left-0 bg-surface-container-high dark:bg-surface-container-high-dark">Café</th>
              <th className="px-4 py-3 text-center w-12">Fav</th>
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
              <tr key={c.id} className="bg-surface dark:bg-card-dark border-b border-outline/10 hover:bg-surface-variant/20 dark:hover:bg-white/5">
                <td className="px-4 py-3 font-medium text-on-surface dark:text-on-surface-dark sticky left-0 bg-surface dark:bg-card-dark whitespace-nowrap border-r border-outline/10">
                    {c.name}
                </td>
                <td className="px-4 py-3 text-center">
                    {c.isFavorite && <HeartFilledIcon className="w-5 h-5 text-red-500 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center font-bold text-primary dark:text-primary-dark bg-primary/5 dark:bg-primary/10">
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

      <div className="mt-8 flex justify-center gap-4 no-print flex-wrap">
        <Button onClick={exportCSV} variant="secondary" className="w-full md:w-auto">
           📥 CSV
        </Button>
        <Button onClick={handlePrint} variant="tonal" className="w-full md:w-auto">
           🖨️ Imprimer
        </Button>
        <Button onClick={generatePDF} variant="filled" className="w-full md:w-auto">
           <PrinterIcon className="w-5 h-5" /> Télécharger PDF
        </Button>
      </div>
    </div>
  );
};

export default SummaryTable;