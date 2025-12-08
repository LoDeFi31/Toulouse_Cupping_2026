
import React from 'react';
import { CoffeeEntry, Session, Language } from '../types';
import { Button, Card } from './UI';
import { HeartFilledIcon, PrinterIcon, CloudUploadIcon } from './Icons';
import { AROMA_TRANSLATIONS } from '../constants';

interface SummaryTableProps {
  session: Session;
  onBack: () => void;
  dict: any;
  language: Language;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ session, onBack, dict, language }) => {
  const coffees = session.coffees;
  
  const calculateScore = (c: CoffeeEntry) => 
    (c.fragranceScore + c.flavorScore + c.aftertasteScore + c.acidityScore + c.bodyScore + c.balanceScore) / 6;

  // Helper to translate notes
  const t_aroma = (term: string) => {
    if (language === 'fr') return term;
    if (AROMA_TRANSLATIONS[term] && AROMA_TRANSLATIONS[term][language as 'en' | 'es']) {
        return AROMA_TRANSLATIONS[term][language as 'en' | 'es'];
    }
    return term;
  };

  const getUniqueNotes = (coffee: CoffeeEntry) => {
      const allNotes = [...coffee.fragranceNotes, ...coffee.flavorNotes];
      return [...new Set(allNotes)];
  };

  const exportCSV = () => {
    const headers = [
        dict.coffeeNamePlaceholder, dict.fav, dict.process, dict.score, "Notes", dict.fragrance, dict.flavor, 
        dict.aftertaste, dict.acidity, dict.body, dict.balance, dict.comments
    ];
    const rows = coffees.map(c => [
        `"${c.name}"`,
        c.isFavorite ? 'Oui' : 'Non',
        c.process,
        calculateScore(c).toFixed(2),
        `"${getUniqueNotes(c).join(', ')}"`, // Notes Column
        c.fragranceScore,
        c.flavorScore,
        c.aftertasteScore,
        c.acidityScore,
        c.bodyScore,
        c.balanceScore,
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
    const win = window as any;
    if (!win.jspdf) {
      alert("La librairie PDF n'est pas encore chargée. Utilisation de l'impression standard.");
      window.print();
      return;
    }

    const { jsPDF } = win.jspdf;
    const doc = new jsPDF('landscape'); // Landscape for better note visibility

    // -- Header --
    doc.setFontSize(22);
    doc.setTextColor(141, 110, 77); // #8D6E4D (Primary Brown)
    doc.text(dict.reportTitle, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Toulouse Cupping App - ${dict.date}: ${session.dateString || new Date().toLocaleDateString()}`, 14, 28);
    if (session.location) {
        doc.text(`${dict.location}: ${session.location}`, 14, 33);
    }
    
    // Session Notes in Header
    let yPos = 33;
    if (session.originNotes || session.roasterNotes) {
        yPos += 5;
        let meta = [];
        if(session.originNotes) meta.push(`${dict.origins}: ${session.originNotes}`);
        if(session.roasterNotes) meta.push(`${dict.roaster}: ${session.roasterNotes}`);
        doc.text(meta.join(' | '), 14, yPos);
    }

    // -- Table Data --
    const tableColumn = [
        dict.coffeeNamePlaceholder, 
        dict.fav, 
        dict.process, 
        dict.score, 
        "Profil Sensoriel", // Merged Notes
        dict.fragrance, 
        dict.flavor, 
        dict.aftertaste, 
        dict.acidity, 
        dict.body, 
        dict.balance
    ];
    
    const tableRows: any[] = [];

    coffees.forEach(coffee => {
      const translatedNotes = getUniqueNotes(coffee).map(n => t_aroma(n)).join(', ');
      
      const coffeeData = [
        coffee.name,
        coffee.isFavorite ? "♥" : "-",
        coffee.process || "-",
        calculateScore(coffee).toFixed(2),
        translatedNotes,
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
    if ((doc as any).autoTable) {
        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: yPos + 10,
            theme: 'striped',
            headStyles: { 
                fillColor: [141, 110, 77], // Primary Color
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 30 }, // Name
                1: { halign: 'center', textColor: [220, 50, 50], cellWidth: 10 }, // Favorite Heart
                3: { fontStyle: 'bold', halign: 'center', cellWidth: 15 }, // Score
                4: { cellWidth: 'auto' } // Profil Sensoriel (Wide)
            }
        });
    }

    // -- Footer --
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Page ' + i + ' / ' + pageCount, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
    }

    doc.save(`cupping_rapport_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="animate-fadeIn p-4 pb-20 max-w-7xl mx-auto" id="printable-area">
      <div className="flex justify-between items-center mb-6 no-print sticky top-0 bg-surface z-20 py-2 border-b border-outline/10">
        <h2 className="text-headline-small font-bold text-primary dark:text-primary-dark">{dict.summary}</h2>
        <Button variant="outlined" onClick={onBack}>{dict.back}</Button>
      </div>

      <div className="mb-4 print-only hidden">
          <h1 className="text-3xl font-bold text-black mb-2">{dict.reportTitle}</h1>
          <p className="text-gray-600">{dict.date}: {session.dateString || new Date().toLocaleDateString()}</p>
          {session.location && <p className="text-gray-600">{dict.location}: {session.location}</p>}
      </div>

      {/* --- MOBILE VIEW: Cards List --- */}
      <div className="md:hidden space-y-4 no-print">
        {coffees.map(coffee => {
           const notes = getUniqueNotes(coffee);
           const score = calculateScore(coffee);
           return (
            <Card key={coffee.id} className="!p-0 overflow-hidden border border-outline/10">
                <div className="p-4 bg-surface-container-high dark:bg-surface-container-high-dark border-b border-outline/10 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                       {coffee.isFavorite && <HeartFilledIcon className="w-5 h-5 text-red-500 animate-pop" />}
                       <h3 className="text-title-medium font-bold text-on-surface dark:text-on-surface-dark truncate max-w-[180px]">{coffee.name}</h3>
                   </div>
                   <div className="flex flex-col items-end">
                       <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">{dict.score}</span>
                       <span className="text-headline-small font-bold text-primary dark:text-primary-dark">{score.toFixed(2)}</span>
                   </div>
                </div>
                
                <div className="p-4 grid grid-cols-3 gap-y-4 gap-x-2 text-center border-b border-outline/10 bg-surface-container-low dark:bg-surface-container-low-dark">
                    {[
                        { l: dict.fragrance, v: coffee.fragranceScore },
                        { l: dict.flavor, v: coffee.flavorScore },
                        { l: dict.acidity, v: coffee.acidityScore },
                        { l: dict.body, v: coffee.bodyScore },
                        { l: dict.aftertaste, v: coffee.aftertasteScore },
                        { l: dict.balance, v: coffee.balanceScore },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[10px] text-on-surface-variant uppercase truncate">{item.l}</span>
                            <span className="text-title-medium font-bold text-on-surface">{item.v}</span>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-surface dark:bg-surface-dark">
                    {coffee.process && (
                        <div className="mb-2">
                            <span className="text-xs font-bold text-on-surface-variant mr-2">{dict.process}:</span>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{coffee.process}</span>
                        </div>
                    )}
                    
                    {notes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {notes.map(n => (
                                <span key={n} className="inline-block px-2 py-0.5 bg-surface-container-highest rounded text-xs text-on-surface-variant border border-outline/10">
                                    {t_aroma(n)}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {coffee.comments && (
                        <p className="text-sm italic text-on-surface-variant/80 mt-2">"{coffee.comments}"</p>
                    )}
                </div>
            </Card>
           );
        })}
      </div>

      {/* --- DESKTOP VIEW: Full Table --- */}
      <div className="hidden md:block overflow-x-auto bg-surface-container-low dark:bg-surface-container-low-dark rounded-xl shadow-md border border-outline/10 no-print">
        <table className="w-full text-body-medium text-left text-on-surface-variant dark:text-on-surface-variant-dark">
          <thead className="text-label-medium uppercase bg-surface-container-high dark:bg-surface-container-high-dark border-b border-outline/10 text-on-surface dark:text-on-surface-dark">
            <tr>
              <th className="px-4 py-3 sticky left-0 bg-surface-container-high dark:bg-surface-container-high-dark z-10 min-w-[150px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{dict.coffeeNamePlaceholder}</th>
              <th className="px-4 py-3 text-center w-12">{dict.fav}</th>
              <th className="px-4 py-3 text-center">{dict.process}</th>
              <th className="px-4 py-3 text-center">{dict.score}</th>
              <th className="px-4 py-3 min-w-[250px]">Profil Aromatique</th>
              <th className="px-4 py-3 text-center w-20">{dict.fragrance}</th>
              <th className="px-4 py-3 text-center w-20">{dict.flavor}</th>
              <th className="px-4 py-3 text-center w-20">{dict.aftertaste}</th>
              <th className="px-4 py-3 text-center w-20">{dict.acidity}</th>
              <th className="px-4 py-3 text-center w-20">{dict.body}</th>
              <th className="px-4 py-3 text-center w-20">{dict.balance}</th>
            </tr>
          </thead>
          <tbody>
            {coffees.map((c, idx) => (
              <tr key={c.id} className="bg-surface dark:bg-card-dark border-b border-outline/10 hover:bg-surface-variant/20 dark:hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-bold text-on-surface dark:text-on-surface-dark sticky left-0 bg-surface dark:bg-card-dark whitespace-nowrap border-r border-outline/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {c.name}
                </td>
                <td className="px-4 py-3 text-center">
                    {c.isFavorite && <HeartFilledIcon className="w-5 h-5 text-red-500 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center text-sm">{c.process || "-"}</td>
                <td className="px-4 py-3 text-center font-bold text-primary dark:text-primary-dark bg-primary/5 dark:bg-primary/10">
                    {calculateScore(c).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                        {getUniqueNotes(c).map(n => (
                            <span key={n} className="inline-block px-2 py-0.5 bg-surface-container-high rounded text-xs text-on-surface-variant border border-outline/10">
                                {t_aroma(n)}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="px-4 py-3 text-center text-on-surface">{c.fragranceScore}</td>
                <td className="px-4 py-3 text-center text-on-surface">{c.flavorScore}</td>
                <td className="px-4 py-3 text-center text-on-surface">{c.aftertasteScore}</td>
                <td className="px-4 py-3 text-center text-on-surface">{c.acidityScore}</td>
                <td className="px-4 py-3 text-center text-on-surface">{c.bodyScore}</td>
                <td className="px-4 py-3 text-center text-on-surface">{c.balanceScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-center gap-4 no-print flex-wrap pb-safe">
        <Button onClick={exportCSV} variant="outlined" className="w-full md:w-auto">
           📥 {dict.csv}
        </Button>
        <Button onClick={handlePrint} variant="tonal" className="w-full md:w-auto">
           🖨️ {dict.print}
        </Button>
        <Button onClick={generatePDF} variant="filled" className="w-full md:w-auto">
           <PrinterIcon className="w-5 h-5" /> {dict.pdf}
        </Button>
      </div>
    </div>
  );
};

export default SummaryTable;
