import React from 'react';

// Cenários em pixel art (320x180), desenhados só com retângulos.
type P = { x: number; y: number; w: number; h: number; c: string; className?: string; style?: React.CSSProperties };
const R = ({ x, y, w, h, c, className, style }: P) => <rect x={x} y={y} width={w} height={h} fill={c} className={className} style={style} />;

// ---------- blocos reutilizáveis ----------
const Wall = ({ c, c2, trim }: { c: string; c2: string; trim: string }) => (
  <g>
    <R x={0} y={0} w={320} h={120} c={c} />
    {Array.from({ length: 20 }, (_, i) => <R key={i} x={i * 16 + 8} y={0} w={1} h={118} c={c2} />)}
    <R x={0} y={116} w={320} h={4} c={trim} />
  </g>
);

const Floor = ({ c, c2, tiles = false }: { c: string; c2: string; tiles?: boolean }) => (
  <g>
    <R x={0} y={120} w={320} h={60} c={c} />
    {Array.from({ length: 6 }, (_, i) => <R key={'h' + i} x={0} y={128 + i * 10} w={320} h={1} c={c2} />)}
    {tiles && Array.from({ length: 16 }, (_, i) => <R key={'v' + i} x={i * 20 + 10} y={120} w={1} h={60} c={c2} />)}
  </g>
);

const WindowP = ({ x, y, w, h, night = false, sunset = false }: { x: number; y: number; w: number; h: number; night?: boolean; sunset?: boolean }) => {
  const sky = night ? '#141b3a' : sunset ? '#f4a259' : '#8fd3ff';
  const sky2 = night ? '#1f2a55' : sunset ? '#f7c58a' : '#bfe8ff';
  return (
    <g>
      <R x={x - 3} y={y - 3} w={w + 6} h={h + 6} c="#3a2f4a" />
      <R x={x} y={y} w={w} h={h} c={sky} />
      <R x={x} y={y + h * 0.6} w={w} h={h * 0.4} c={sky2} />
      {/* prédios ao fundo */}
      <R x={x + 4} y={y + h - 18} w={10} h={18} c={night ? '#0c1026' : '#6aa7c9'} />
      <R x={x + 16} y={y + h - 26} w={12} h={26} c={night ? '#0e1430' : '#5c97ba'} />
      <R x={x + w - 22} y={y + h - 20} w={14} h={20} c={night ? '#0c1026' : '#6aa7c9'} />
      {night && (
        <>
          <R x={x + 7} y={y + h - 14} w={2} h={2} c="#ffd166" className="px-twinkle" />
          <R x={x + 20} y={y + h - 20} w={2} h={2} c="#ffd166" className="px-twinkle-2" />
          <R x={x + w - 17} y={y + h - 12} w={2} h={2} c="#ffd166" className="px-twinkle" />
          <R x={x + 8} y={y + 5} w={1} h={1} c="#ffffff" className="px-twinkle-2" />
          <R x={x + w - 10} y={y + 8} w={1} h={1} c="#ffffff" className="px-twinkle" />
          <R x={x + w - 14} y={y + 4} w={4} h={4} c="#f5f3ce" />
        </>
      )}
      {!night && !sunset && (
        <>
          <R x={x + 6} y={y + 6} w={12} h={3} c="#ffffff" />
          <R x={x + 9} y={y + 4} w={6} h={2} c="#ffffff" />
        </>
      )}
      <R x={x + w / 2 - 1} y={y} w={2} h={h} c="#3a2f4a" />
      <R x={x} y={y + h / 2 - 1} w={w} h={2} c="#3a2f4a" />
    </g>
  );
};

const Plant = ({ x, y }: { x: number; y: number }) => (
  <g>
    <R x={x + 2} y={y + 14} w={10} h={10} c="#b5651d" />
    <R x={x + 1} y={y + 13} w={12} h={2} c="#8b4513" />
    <R x={x + 5} y={y} w={4} h={14} c="#2e7d32" />
    <R x={x} y={y + 4} w={6} h={4} c="#43a047" />
    <R x={x + 8} y={y + 2} w={6} h={4} c="#43a047" />
    <R x={x + 3} y={y + 8} w={3} h={3} c="#66bb6a" />
  </g>
);

const Clock = ({ x, y }: { x: number; y: number }) => (
  <g>
    <R x={x} y={y} w={12} h={12} c="#f5f5f5" />
    <R x={x - 1} y={y + 1} w={1} h={10} c="#3a2f4a" /><R x={x + 12} y={y + 1} w={1} h={10} c="#3a2f4a" />
    <R x={x + 1} y={y - 1} w={10} h={1} c="#3a2f4a" /><R x={x + 1} y={y + 12} w={10} h={1} c="#3a2f4a" />
    <R x={x + 6} y={y + 2} w={1} h={5} c="#1a1423" />
    <R x={x + 6} y={y + 6} w={3} h={1} c="#c0392b" className="px-blink-slow" />
  </g>
);

const Desk = ({ x, y, w = 70, monitor = true, lamp = false }: { x: number; y: number; w?: number; monitor?: boolean; lamp?: boolean }) => (
  <g>
    <R x={x} y={y} w={w} h={6} c="#8d6e63" />
    <R x={x} y={y + 6} w={w} h={2} c="#6d4c41" />
    <R x={x + 3} y={y + 8} w={4} h={20} c="#5d4037" />
    <R x={x + w - 7} y={y + 8} w={4} h={20} c="#5d4037" />
    {monitor && (
      <g>
        <R x={x + w / 2 - 14} y={y - 22} w={28} h={18} c="#263238" />
        <R x={x + w / 2 - 12} y={y - 20} w={24} h={14} c="#4fc3f7" className="px-twinkle-2" />
        <R x={x + w / 2 - 10} y={y - 17} w={12} h={2} c="#e1f5fe" />
        <R x={x + w / 2 - 10} y={y - 13} w={18} h={2} c="#b3e5fc" />
        <R x={x + w / 2 - 2} y={y - 4} w={4} h={4} c="#37474f" />
      </g>
    )}
    {lamp && (
      <g>
        <R x={x + 4} y={y - 14} w={2} h={14} c="#37474f" />
        <R x={x + 1} y={y - 18} w={10} h={5} c="#ffca28" />
      </g>
    )}
    <R x={x + w - 18} y={y - 3} w={8} h={3} c="#ffffff" />
    <R x={x + w - 26} y={y - 5} w={5} h={5} c="#e53935" />
  </g>
);

const Shelf = ({ x, y, h = 90 }: { x: number; y: number; h?: number }) => {
  const boxes = ['#c49a6c', '#d7b48a', '#b5835a', '#e0c097'];
  return (
    <g>
      <R x={x} y={y} w={4} h={h} c="#e65100" />
      <R x={x + 56} y={y} w={4} h={h} c="#e65100" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <R x={x} y={y + 28 + r * 30} w={60} h={3} c="#1565c0" />
          {[0, 1, 2].map((b) => (
            <R key={b} x={x + 6 + b * 17} y={y + 10 + r * 30} w={15} h={18} c={boxes[(r + b) % 4]} />
          ))}
          <R x={x + 9 + r * 6} y={y + 16 + r * 30} w={8} h={2} c="#6d4c41" />
        </g>
      ))}
    </g>
  );
};

const Table = ({ x, y, w }: { x: number; y: number; w: number }) => (
  <g>
    <R x={x} y={y} w={w} h={8} c="#5d4037" />
    <R x={x} y={y + 8} w={w} h={3} c="#3e2723" />
    {Array.from({ length: Math.floor(w / 40) }, (_, i) => (
      <g key={i}>
        <R x={x + 12 + i * 40} y={y - 14} w={14} h={14} c="#37474f" />
        <R x={x + 14 + i * 40} y={y - 12} w={10} h={8} c="#546e7a" />
      </g>
    ))}
  </g>
);

const Poster = ({ x, y, c, c2 }: { x: number; y: number; c: string; c2: string }) => (
  <g>
    <R x={x} y={y} w={22} h={28} c={c} />
    <R x={x + 3} y={y + 4} w={16} h={12} c={c2} />
    <R x={x + 3} y={y + 19} w={16} h={2} c="#ffffff" />
    <R x={x + 3} y={y + 23} w={10} h={2} c="#ffffff" />
  </g>
);

const Chart = ({ x, y }: { x: number; y: number }) => (
  <g>
    <R x={x} y={y} w={60} h={38} c="#fafafa" />
    <R x={x - 2} y={y - 2} w={64} h={2} c="#90a4ae" />
    <R x={x + 8} y={y + 22} w={8} h={12} c="#2B7A8C" />
    <R x={x + 20} y={y + 14} w={8} h={20} c="#2B7A8C" />
    <R x={x + 32} y={y + 8} w={8} h={26} c="#E0A526" />
    <R x={x + 44} y={y + 26} w={8} h={8} c="#e53935" />
  </g>
);

const Boxes = ({ x, y }: { x: number; y: number }) => (
  <g>
    <R x={x} y={y + 14} w={40} h={4} c="#8d6e63" />
    <R x={x + 2} y={y} w={17} h={14} c="#d7b48a" />
    <R x={x + 21} y={y} w={17} h={14} c="#c49a6c" />
    <R x={x + 10} y={y - 13} w={17} h={13} c="#e0c097" />
    <R x={x + 9} y={y + 5} w={3} h={3} c="#43a047" />
  </g>
);

const Forklift = ({ x, y }: { x: number; y: number }) => (
  <g>
    <R x={x} y={y + 8} w={34} h={16} c="#fbc02d" />
    <R x={x + 6} y={y - 8} w={20} h={16} c="#37474f" />
    <R x={x + 8} y={y - 6} w={16} h={12} c="#90caf9" />
    <R x={x + 36} y={y - 14} w={3} h={38} c="#455a64" />
    <R x={x + 39} y={y + 20} w={16} h={3} c="#455a64" />
    <R x={x + 4} y={y + 22} w={9} h={9} c="#212121" />
    <R x={x + 22} y={y + 22} w={9} h={9} c="#212121" />
    <R x={x + 7} y={y + 25} w={3} h={3} c="#9e9e9e" />
    <R x={x + 25} y={y + 25} w={3} h={3} c="#9e9e9e" />
  </g>
);

const Lights = ({ party = false }: { party?: boolean }) => (
  <g>
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i}>
        <R x={20 + i * 52} y={0} w={2} h={10} c="#455a64" />
        <R x={12 + i * 52} y={10} w={18} h={4} c="#607d8b" />
        <R x={14 + i * 52} y={14} w={14} h={2} c={party ? ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff'][i % 4] : '#fff9c4'} className={party ? (i % 2 ? 'px-party-a' : 'px-party-b') : undefined} />
      </g>
    ))}
  </g>
);

const Bunting = () => (
  <g>
    {Array.from({ length: 20 }, (_, i) => (
      <R key={i} x={i * 16 + 4} y={26 + (i % 2) * 2} w={8} h={8} c={['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff'][i % 4]} className={i % 2 ? 'px-party-a' : 'px-party-b'} />
    ))}
    <R x={0} y={25} w={320} h={1} c="#ffffff" />
  </g>
);

// ---------- cenas ----------
const scenes: Record<string, () => React.ReactElement> = {
  quarto_lia_noite: () => (
    <g>
      <Wall c="#2c2350" c2="#332a5c" trim="#1f1838" />
      <Floor c="#5b3a29" c2="#4a2f22" />
      <WindowP x={30} y={22} w={70} h={56} night />
      <Poster x={130} y={26} c="#E0A526" c2="#2B7A8C" />
      <Poster x={160} y={34} c="#ff6fae" c2="#ffffff" />
      <R x={210} y={70} w={90} h={30} c="#ffccbc" /><R x={210} y={64} w={24} h={10} c="#ffffff" /><R x={210} y={96} w={90} h={22} c="#8d6e63" />
      <R x={234} y={70} w={66} h={12} c="#E0A526" />
      <R x={110} y={88} w={30} h={30} c="#6d4c41" /><R x={116} y={78} w={6} h={10} c="#ffca28" className="px-twinkle" /><R x={113} y={74} w={12} h={4} c="#fff3c4" />
      <R x={150} y={96} w={22} h={14} c="#2B7A8C" /><R x={152} y={92} w={18} h={4} c="#1f5c69" />
    </g>
  ),
  quarto_lia_manha: () => (
    <g>
      <Wall c="#b8a4e3" c2="#c4b2ea" trim="#8f78c9" />
      <Floor c="#8d5b3e" c2="#7a4d33" />
      <WindowP x={30} y={22} w={70} h={56} />
      <Poster x={130} y={26} c="#E0A526" c2="#2B7A8C" />
      <Poster x={160} y={34} c="#ff6fae" c2="#ffffff" />
      <R x={210} y={70} w={90} h={30} c="#ffccbc" /><R x={210} y={64} w={24} h={10} c="#ffffff" /><R x={210} y={96} w={90} h={22} c="#8d6e63" />
      <R x={234} y={70} w={66} h={12} c="#E0A526" />
      <R x={150} y={96} w={22} h={14} c="#2B7A8C" /><R x={152} y={92} w={18} h={4} c="#1f5c69" />
      <R x={30} y={80} w={70} h={4} c="#fff8e1" />
    </g>
  ),
  sala_reuniao: () => (
    <g>
      <Wall c="#cfd8dc" c2="#d9e1e4" trim="#90a4ae" />
      <Floor c="#546e7a" c2="#4b626d" tiles />
      <WindowP x={16} y={18} w={60} h={60} />
      <R x={96} y={14} w={130} h={74} c="#263238" /><R x={100} y={18} w={122} h={66} c="#eceff1" />
      <R x={108} y={24} w={60} h={4} c="#455a64" />
      <R x={110} y={66} w={10} h={12} c="#2B7A8C" /><R x={124} y={56} w={10} h={22} c="#2B7A8C" /><R x={138} y={44} w={10} h={34} c="#E0A526" />
      <R x={160} y={40} w={52} h={38} c="#ffcdd2" /><R x={170} y={48} w={32} h={4} c="#c62828" /><R x={176} y={56} w={20} h={14} c="#e53935" />
      <Clock x={246} y={20} />
      <Plant x={286} y={88} />
      <R x={240} y={50} w={30} h={24} c="#a1887f" /><R x={243} y={53} w={24} h={14} c="#8bc34a" /><R x={249} y={58} w={12} h={6} c="#ffeb3b" />
      <Table x={60} y={108} w={200} />
    </g>
  ),
  open_space_marketing: () => (
    <g>
      <Wall c="#ffe0b2" c2="#ffe8c4" trim="#e0a96a" />
      <Floor c="#90a4ae" c2="#7f939d" tiles />
      <WindowP x={232} y={16} w={70} h={56} />
      <R x={20} y={18} w={80} h={50} c="#fafafa" />
      {['#ff8a80', '#ffd180', '#ccff90', '#80d8ff', '#ea80fc', '#ffff8d'].map((c, i) => (
        <R key={i} x={26 + (i % 3) * 24} y={24 + Math.floor(i / 3) * 20} w={16} h={14} c={c} />
      ))}
      <Poster x={120} y={24} c="#d6417e" c2="#E0A526" />
      <Poster x={150} y={30} c="#2B7A8C" c2="#ffe0b2" />
      <Desk x={30} y={94} w={90} />
      <Desk x={190} y={94} w={90} lamp />
      <Plant x={140} y={92} />
    </g>
  ),
  corredor_vidro: () => (
    <g>
      <Wall c="#b0bec5" c2="#bccbd1" trim="#78909c" />
      <Floor c="#cfd8dc" c2="#b0bec5" tiles />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <R x={14 + i * 76} y={10} w={66} h={106} c="#bfe6f7" />
          <R x={14 + i * 76} y={10} w={66} h={106} c="#ffffff" className="px-twinkle-2" />
          <R x={20 + i * 76} y={16} w={4} h={60} c="#ffffff" />
          <R x={12 + i * 76} y={10} w={2} h={106} c="#607d8b" />
        </g>
      ))}
      <R x={92} y={40} w={60} h={50} c="#90a4ae" />
      <R x={100} y={58} w={10} h={30} c="#d97706" /><R x={99} y={50} w={12} h={10} c="#f6d2b8" /><R x={99} y={48} w={12} h={4} c="#5c4033" />
      <R x={124} y={58} w={10} h={30} c="#d6417e" /><R x={123} y={50} w={12} h={10} c="#e0a878" /><R x={122} y={48} w={14} h={5} c="#7b3f1d" />
      <R x={110} y={44} w={22} h={14} c="#fafafa" />
      <R x={14} y={10} w={300} h={106} c="#e1f5fe" className="px-twinkle" style={{ opacity: 0.08 }} />
    </g>
  ),
  galpao_dia: () => (
    <g>
      <R x={0} y={0} w={320} h={120} c="#78909c" />
      {Array.from({ length: 10 }, (_, i) => <R key={i} x={i * 32} y={0} w={2} h={116} c="#6b818c" />)}
      <R x={0} y={0} w={320} h={8} c="#546e7a" />
      <Lights />
      <Floor c="#9e9e9e" c2="#8e8e8e" />
      <R x={0} y={150} w={320} h={4} c="#fbc02d" />
      <Shelf x={14} y={26} />
      <Shelf x={86} y={26} />
      <R x={176} y={40} w={46} h={76} c="#455a64" /><R x={180} y={44} w={38} h={72} c="#607d8b" />
      {Array.from({ length: 6 }, (_, i) => <R key={i} x={180} y={48 + i * 11} w={38} h={2} c="#546e7a" />)}
      <R x={176} y={30} w={46} h={8} c="#fbc02d" /><R x={182} y={32} w={34} h={4} c="#1a1423" />
      <Forklift x={236} y={88} />
      <Boxes x={140} y={100} />
    </g>
  ),
  galpao_escuro: () => (
    <g>
      <R x={0} y={0} w={320} h={120} c="#1c2328" />
      {Array.from({ length: 10 }, (_, i) => <R key={i} x={i * 32} y={0} w={2} h={116} c="#182025" />)}
      <Floor c="#2a2f33" c2="#23282c" />
      <Shelf x={14} y={26} />
      <Shelf x={86} y={26} />
      <R x={0} y={0} w={320} h={180} c="#0b0e1a" style={{ opacity: 0.55 }} />
      <R x={230} y={0} w={4} h={40} c="#455a64" /><R x={222} y={40} w={20} h={6} c="#607d8b" />
      <R x={214} y={46} w={36} h={70} c="#fff9c4" style={{ opacity: 0.15 }} />
      <R x={226} y={46} w={12} h={2} c="#fff59d" className="px-blink-slow" />
    </g>
  ),
  galpao_festa: () => (
    <g>
      <R x={0} y={0} w={320} h={120} c="#78909c" />
      {Array.from({ length: 10 }, (_, i) => <R key={i} x={i * 32} y={0} w={2} h={116} c="#6b818c" />)}
      <Lights party />
      <Bunting />
      <Floor c="#9e9e9e" c2="#8e8e8e" />
      <Shelf x={14} y={40} h={76} />
      <R x={110} y={44} w={100} h={30} c="#fafafa" /><R x={116} y={50} w={88} h={6} c="#E0A526" /><R x={124} y={60} w={72} h={6} c="#2B7A8C" />
      <R x={226} y={96} w={80} h={6} c="#8d6e63" /><R x={230} y={102} w={4} h={16} c="#5d4037" /><R x={298} y={102} w={4} h={16} c="#5d4037" />
      <R x={236} y={84} w={16} h={12} c="#f8bbd0" /><R x={236} y={80} w={16} h={4} c="#ffffff" /><R x={243} y={74} w={2} h={6} c="#ffd166" className="px-blink-slow" />
      <R x={262} y={86} w={8} h={10} c="#ff7043" /><R x={276} y={86} w={8} h={10} c="#66bb6a" /><R x={288} y={86} w={8} h={10} c="#42a5f5" />
    </g>
  ),
  doca: () => (
    <g>
      <R x={0} y={0} w={320} h={120} c="#8d9ba3" />
      <R x={40} y={14} w={180} h={102} c="#37474f" />
      <R x={44} y={18} w={172} h={98} c="#9fd3ec" />
      <R x={44} y={86} w={172} h={30} c="#7a8b93" />
      <R x={70} y={40} w={120} h={56} c="#eceff1" /><R x={70} y={40} w={120} h={10} c="#2e7d32" />
      <R x={78} y={58} w={60} h={4} c="#2e7d32" /><R x={78} y={66} w={40} h={4} c="#2e7d32" />
      <R x={150} y={56} w={30} h={24} c="#43a047" /><R x={156} y={62} w={8} h={8} c="#c5e1a5" />
      <R x={40} y={14} w={180} h={6} c="#fbc02d" />
      {Array.from({ length: 9 }, (_, i) => <R key={i} x={40 + i * 20} y={14} w={10} h={6} c="#1a1423" />)}
      <Floor c="#757575" c2="#666666" />
      <R x={0} y={120} w={320} h={6} c="#fbc02d" />
      <Boxes x={240} y={100} />
      <Boxes x={260} y={86} />
      <R x={280} y={30} w={24} h={30} c="#eceff1" /><R x={284} y={34} w={16} h={4} c="#e53935" /><R x={284} y={42} w={16} h={2} c="#90a4ae" /><R x={284} y={47} w={12} h={2} c="#90a4ae" />
    </g>
  ),
  copa: () => (
    <g>
      <Wall c="#c8e6c9" c2="#d4ecd5" trim="#81c784" />
      <Floor c="#d7ccc8" c2="#c3b6b1" tiles />
      <R x={14} y={66} w={150} h={50} c="#8d6e63" /><R x={14} y={62} w={150} h={6} c="#efebe9" />
      <R x={14} y={20} w={150} h={30} c="#a1887f" /><R x={20} y={26} w={30} h={20} c="#8d6e63" /><R x={56} y={26} w={30} h={20} c="#8d6e63" /><R x={92} y={26} w={30} h={20} c="#8d6e63" />
      <R x={30} y={42} w={20} h={20} c="#37474f" /><R x={34} y={48} w={12} h={6} c="#e53935" className="px-blink-slow" />
      <R x={36} y={34} w={2} h={6} c="#ffffff" className="px-steam" /><R x={42} y={32} w={2} h={6} c="#ffffff" className="px-steam" />
      <R x={70} y={54} w={8} h={8} c="#ffffff" /><R x={82} y={54} w={8} h={8} c="#E0A526" /><R x={94} y={54} w={8} h={8} c="#2B7A8C" />
      <R x={120} y={46} w={20} h={16} c="#d7ccc8" /><R x={122} y={44} w={16} h={2} c="#a1887f" />
      <R x={200} y={30} w={44} h={86} c="#eceff1" /><R x={200} y={66} w={44} h={2} c="#b0bec5" /><R x={238} y={40} w={2} h={14} c="#90a4ae" /><R x={238} y={76} w={2} h={14} c="#90a4ae" />
      <R x={206} y={40} w={8} h={8} c="#ff8a80" /><R x={218} y={38} w={6} h={10} c="#ffd180" />
      <Clock x={270} y={24} />
      <Plant x={276} y={92} />
    </g>
  ),
  mesa_rafa_dia: () => (
    <g>
      <Wall c="#d1c4e9" c2="#dacfee" trim="#9575cd" />
      <Floor c="#90a4ae" c2="#7f939d" tiles />
      <WindowP x={226} y={16} w={76} h={60} />
      <R x={16} y={14} w={110} h={70} c="#fafafa" /><R x={14} y={12} w={114} h={2} c="#90a4ae" />
      <R x={24} y={24} w={30} h={2} c="#1565c0" /><R x={24} y={30} w={40} h={2} c="#1565c0" />
      <R x={70} y={22} w={44} h={30} c="#e3f2fd" /><R x={74} y={44} w={4} h={6} c="#8E6CC4" /><R x={82} y={38} w={4} h={12} c="#8E6CC4" /><R x={90} y={30} w={4} h={20} c="#c62828" /><R x={98} y={42} w={4} h={8} c="#8E6CC4" />
      <R x={24} y={60} w={50} h={2} c="#c62828" /><R x={24} y={66} w={36} h={2} c="#1565c0" />
      <Chart x={146} y={24} />
      <Desk x={110} y={96} w={110} />
      <R x={230} y={84} w={14} h={12} c="#ffffff" /><R x={244} y={86} w={3} h={6} c="#ffffff" /><R x={233} y={80} w={2} h={4} c="#ffffff" className="px-steam" />
    </g>
  ),
  mesa_rafa_noite: () => (
    <g>
      <Wall c="#2a2440" c2="#30294a" trim="#1d1830" />
      <Floor c="#37474f" c2="#2f3d44" tiles />
      <WindowP x={226} y={16} w={76} h={60} night />
      <R x={16} y={14} w={110} h={70} c="#b8b5c8" /><R x={70} y={22} w={44} h={30} c="#a5b8c8" /><R x={90} y={30} w={4} h={20} c="#c62828" />
      <R x={24} y={24} w={30} h={2} c="#1565c0" /><R x={24} y={60} w={50} h={2} c="#c62828" />
      <Desk x={110} y={96} w={110} lamp />
      <R x={100} y={60} w={130} h={56} c="#4fc3f7" style={{ opacity: 0.1 }} />
      <R x={150} y={80} w={6} h={10} c="#eceff1" /><R x={160} y={82} w={6} h={8} c="#eceff1" />
    </g>
  ),
  elevador: () => (
    <g>
      <R x={0} y={0} w={320} h={180} c="#9e9e9e" />
      {Array.from({ length: 12 }, (_, i) => <R key={i} x={i * 28} y={0} w={1} h={180} c="#8a8a8a" />)}
      <R x={80} y={10} w={160} h={8} c="#424242" />
      {[0, 1, 2, 3, 4].map((i) => <R key={i} x={142 + i * 8} y={12} w={5} h={4} c={i === 2 ? '#ff5252' : '#616161'} className={i === 2 ? 'px-blink-slow' : undefined} />)}
      <R x={268} y={40} w={24} h={50} c="#616161" />
      {[0, 1, 2, 3].map((i) => <R key={i} x={274} y={46 + i * 10} w={12} h={6} c={i === 1 ? '#ffd54f' : '#bdbdbd'} />)}
      <R x={0} y={140} w={320} h={40} c="#757575" />
      {Array.from({ length: 20 }, (_, i) => <R key={i} x={i * 16} y={140} w={8} h={40} c="#6d6d6d" />)}
      <R x={24} y={40} w={6} h={60} c="#bdbdbd" />
      <R x={150} y={30} w={20} h={6} c="#fffde7" className="px-blink-slow" />
    </g>
  ),
  casa_bruno_noite: () => (
    <g>
      <Wall c="#4e3b5c" c2="#574266" trim="#3a2b45" />
      <Floor c="#6d4c41" c2="#5d4037" />
      <WindowP x={20} y={20} w={64} h={56} night />
      <R x={110} y={30} w={30} h={22} c="#ffe0b2" /><R x={113} y={33} w={24} h={16} c="#90caf9" /><R x={118} y={40} w={6} h={9} c="#f472b6" />
      <R x={150} y={34} w={20} h={18} c="#ffe0b2" /><R x={153} y={37} w={14} h={12} c="#c5e1a5" />
      <R x={190} y={80} w={110} h={36} c="#2B7A8C" /><R x={190} y={70} w={110} h={14} c="#1f5c69" /><R x={196} y={84} w={30} h={10} c="#E0A526" />
      <R x={100} y={78} w={10} h={38} c="#8d6e63" /><R x={92} y={66} w={26} h={12} c="#fff3c4" className="px-twinkle" />
      <R x={248} y={50} w={8} h={20} c="#a1887f" /><R x={246} y={46} w={12} h={6} c="#8d6e63" /><R x={251} y={30} w={2} h={18} c="#5d4037" />
    </g>
  ),
  banheiro: () => (
    <g>
      <R x={0} y={0} w={320} h={120} c="#e0f2f1" />
      {Array.from({ length: 20 }, (_, i) => <R key={'a' + i} x={i * 16} y={0} w={1} h={120} c="#c8e6e2" />)}
      {Array.from({ length: 8 }, (_, i) => <R key={'b' + i} x={0} y={i * 16} w={320} h={1} c="#c8e6e2" />)}
      <Floor c="#b2dfdb" c2="#9fd3ce" tiles />
      {[0, 1].map((i) => (
        <g key={i}>
          <R x={30 + i * 70} y={20} w={46} h={40} c="#b3e5fc" /><R x={28 + i * 70} y={18} w={50} h={2} c="#90a4ae" />
          <R x={36 + i * 70} y={24} w={4} h={20} c="#ffffff" />
          <R x={30 + i * 70} y={76} w={46} h={10} c="#fafafa" /><R x={50 + i * 70} y={70} w={4} h={8} c="#90a4ae" />
          <R x={36 + i * 70} y={86} w={34} h={30} c="#eceff1" />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <R x={200 + i * 40} y={20} w={36} h={96} c="#80cbc4" /><R x={226 + i * 40} y={66} w={4} h={6} c="#00695c" />
        </g>
      ))}
    </g>
  ),
  sala_orbe: () => (
    <g>
      <Wall c="#eceff1" c2="#f3f5f6" trim="#b0bec5" />
      <Floor c="#455a64" c2="#3d4f58" tiles />
      <R x={0} y={0} w={320} h={10} c="#263238" />
      <R x={20} y={20} w={56} h={56} c="#e53935" /><R x={32} y={32} w={32} h={32} c="#ffffff" /><R x={40} y={40} w={16} h={16} c="#e53935" />
      <R x={20} y={80} w={56} h={6} c="#263238" /><R x={26} y={81} w={44} h={4} c="#fafafa" />
      <WindowP x={110} y={16} w={130} h={64} />
      <Plant x={260} y={92} />
      <R x={270} y={24} w={30} h={40} c="#cfd8dc" /><R x={274} y={28} w={22} h={6} c="#e53935" /><R x={274} y={38} w={22} h={2} c="#90a4ae" /><R x={274} y={44} w={16} h={2} c="#90a4ae" />
      <Table x={40} y={108} w={240} />
    </g>
  ),
};

export const SCENE_LABELS: Record<string, string> = {
  quarto_lia_noite: 'Quarto da Lia · Noite',
  quarto_lia_manha: 'Quarto da Lia · Manhã',
  sala_reuniao: 'Sala de reunião',
  open_space_marketing: 'Open space · Marketing',
  corredor_vidro: 'Corredor de vidro',
  galpao_dia: 'Galpão',
  galpao_escuro: 'Galpão · Noite',
  galpao_festa: 'Galpão · Festa',
  doca: 'Doca de carga',
  copa: 'Copa',
  mesa_rafa_dia: 'Mesa do Rafa',
  mesa_rafa_noite: 'Mesa do Rafa · Noite',
  elevador: 'Elevador',
  casa_bruno_noite: 'Casa do Bruno',
  banheiro: 'Banheiro',
  sala_orbe: 'Sala do Grupo Orbe',
};

export default function Scene({ bg }: { bg: string }) {
  const draw = scenes[bg] ?? scenes.sala_reuniao;
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" className="absolute inset-0 w-full h-full" aria-hidden>
      {draw()}
    </svg>
  );
}
