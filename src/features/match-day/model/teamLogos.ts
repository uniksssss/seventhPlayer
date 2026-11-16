import type { LeagueId, TeamLogo } from './matchDay';

export const teamLogosByLeague: Record<LeagueId, readonly TeamLogo[]> = {
  superleague: [
    { id: 'uralochka', name: 'Уралочка-НТМК', src: '/logos-superliga/uralochka.png' },
    { id: 'dinamoAkBars', name: 'Динамо-Ак Барс', src: '/logos-superliga/dinamoAkBars.png' },
    { id: 'moscow', name: 'Динамо (Москва)', src: '/logos-superliga/moscow.png' },
    {
      id: 'dinamoKrasnodar',
      name: 'Динамо (Краснодар)',
      src: '/logos-superliga/dinamoKrasnodar.png',
    },
    { id: 'dinamoMetar', name: 'Динамо-Метар', src: '/logos-superliga/dinamoMetar.png' },
    { id: 'enisey', name: 'Енисей', src: '/logos-superliga/enisey.png' },
    { id: 'zarechye', name: 'Заречье-Одинцово', src: '/logos-superliga/zarechye.png' },
    { id: 'korabelka', name: 'Корабелка', src: '/logos-superliga/korabelka.png' },
    { id: 'leningradka', name: 'Ленинградка', src: '/logos-superliga/leningradka.png' },
    { id: 'loko', name: 'Локомотив', src: '/logos-superliga/loko.png' },
    { id: 'minsk', name: 'Минчанка', src: '/logos-superliga/minsk.png' },
    { id: 'omichka', name: 'Омичка', src: '/logos-superliga/omichka.png' },
    { id: 'proton', name: 'Протон', src: '/logos-superliga/proton.png' },
    { id: 'tulitsa', name: 'Тулица', src: '/logos-superliga/tulitsa.png' },
  ],
  'major-a': [
    { id: 'uralochka', name: 'Уралочка', src: '/logos-liga-a/uralochka.png' },
    { id: 'amur', name: 'Амурские тигрицы', src: '/logos-liga-a/amur.png' },
    { id: 'anapa', name: 'Динамо (Анапа)', src: '/logos-liga-a/anapa.png' },
    { id: 'ural', name: 'Динамо-Урал', src: '/logos-liga-a/ural.png' },
    { id: 'dinamoMetar', name: 'Динамо-Метар', src: '/logos-liga-a/dinamoMetar.png' },
    { id: 'primorskiy', name: 'Динамо (Приморский край)', src: '/logos-liga-a/primorskiy.png' },
    { id: 'zabaykalka', name: 'Забайкалка', src: '/logos-liga-a/zabaykalka.png' },
    { id: 'loko', name: 'Локомотив', src: '/logos-liga-a/loko.png' },
    { id: 'mba', name: 'МБА', src: '/logos-liga-a/mba.png' },
    { id: 'rgu', name: 'Рязань-РГУ', src: '/logos-liga-a/rgu.png' },
    { id: 'severyanka', name: 'Северянка', src: '/logos-liga-a/severyanka.png' },
    { id: 'atom', name: 'ЮЗГУ-Атом', src: '/logos-liga-a/atom.png' },
  ],
};
