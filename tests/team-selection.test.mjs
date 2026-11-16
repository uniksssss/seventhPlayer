import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import test from 'node:test';
import { initialMatchDay } from '../src/features/match-day/model/matchDay.ts';
import { teamLogosByLeague } from '../src/features/match-day/model/teamLogos.ts';
import { selectTeamLogo } from '../src/features/match-day/model/teamSelection.ts';

for (const [league, logos] of Object.entries(teamLogosByLeague)) {
  const uralochka = logos.find((logo) => logo.id === 'uralochka');
  const opponent = logos.find((logo) => logo.id !== 'uralochka');
  const draft = { ...initialMatchDay, league };

  test(`${league}: all supplied logos are listed, without duplicates or missing files`, async () => {
    const directory = league === 'superleague' ? 'logos-superliga' : 'logos-liga-a';
    const files = await readdir(new URL(`../public/${directory}/`, import.meta.url));
    assert.deepEqual(
      logos.map((logo) => logo.src.split('/').at(-1)).sort(),
      files.filter((name) => name.endsWith('.png')).sort(),
    );
    assert.equal(new Set(logos.map((logo) => logo.id)).size, logos.length);
    assert.ok(uralochka);
  });

  test(`${league}: selecting an opponent or custom first logo adds the league's Uralochka`, () => {
    for (const src of [opponent.src, 'data:image/png;base64,custom']) {
      const result = selectTeamLogo(draft, 'homeLogo', src, logos);
      assert.equal(result.homeLogo, src);
      assert.equal(result.awayLogo, uralochka.src);
    }
    assert.equal(draft.homeLogo, null);
  });

  test(`${league}: selecting Uralochka first clears the second team`, () => {
    const selected = { ...draft, homeLogo: opponent.src, awayLogo: uralochka.src };
    const result = selectTeamLogo(selected, 'homeLogo', uralochka.src, logos);
    assert.equal(result.homeLogo, uralochka.src);
    assert.equal(result.awayLogo, null);
  });

  test(`${league}: a manual second team can be selected without changing the first`, () => {
    const result = selectTeamLogo(
      { ...draft, homeLogo: uralochka.src },
      'awayLogo',
      opponent.src,
      logos,
    );
    assert.equal(result.homeLogo, uralochka.src);
    assert.equal(result.awayLogo, opponent.src);
  });

  test(`${league}: clearing the first team clears the automatic second logo`, () => {
    const result = selectTeamLogo(
      { ...draft, homeLogo: opponent.src, awayLogo: uralochka.src },
      'homeLogo',
      null,
      logos,
    );
    assert.equal(result.homeLogo, null);
    assert.equal(result.awayLogo, null);
  });
}
