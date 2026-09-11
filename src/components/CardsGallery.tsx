import React from 'react';
import { SalawatCard } from '../types';
import { Sparkles, Eye, Check } from 'lucide-react';

interface CardsGalleryProps {
  cards: SalawatCard[];
  selectedCardId?: string;
  onSelectCard: (card: SalawatCard) => void;
  onPreviewCard: (card: SalawatCard) => void;
}

export const CardsGallery: React.FC<CardsGalleryProps> = ({
  cards,
  selectedCardId,
  onSelectCard,
  onPreviewCard,
}) => {
  return (
    <div id="cards-gallery-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white font-cairo flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            بطاقات وصيغ الصلاة على النبي ﷺ
          </h3>
          <p className="text-xs text-emerald-300/80">
            اختر الصيغة المفضلة أو استعرضها كنافذة منبثقة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => {
          const isSelected = selectedCardId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#113a2c] to-[#0b241c] border-amber-400/80 shadow-lg shadow-amber-950/40'
                  : 'bg-emerald-950/50 hover:bg-emerald-900/40 border-emerald-800/60'
              }`}
            >
              {/* Top info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-amber-300 border border-emerald-700/50">
                    {card.source}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      المختارة
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-white font-cairo mb-1.5">{card.title}</h4>
                <p className="text-xs text-emerald-200 line-clamp-3 font-amiri font-semibold leading-relaxed mb-3">
                  « {card.arabicText} »
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-emerald-800/40 flex items-center justify-between gap-2 mt-auto">
                <button
                  onClick={() => onPreviewCard(card)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-xs font-semibold text-emerald-100 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة الصورة المنبثقة</span>
                </button>

                <button
                  onClick={() => onSelectCard(card)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isSelected
                      ? 'bg-amber-500 text-emerald-950'
                      : 'bg-emerald-900/60 hover:bg-emerald-800 text-amber-200'
                  }`}
                >
                  {isSelected ? 'مفعلة' : 'تعيين'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
