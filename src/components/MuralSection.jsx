import { useSpotlight } from '../hooks/useSpotlight'

export default function MuralSection() {
  useSpotlight()

  return (
    <a
      data-glow
      href="#"
      className="mural-newspaper grain p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-all hover:brightness-110 hover:shadow-lg cursor-pointer group animate-fade-in-up relative"
      style={{ animationDelay: '0.3s', '--base': 210, '--spread': 60 }}
    >
      {/* Megafone + Raios sobrepostos */}
      <div className="hidden sm:block absolute bottom-[-4px] left-[-56px] w-28 h-28 pointer-events-none">
        {/* Megafone */}
        <img
          src="/illustrations/megafone.png"
          alt="Megafone"
          className="absolute inset-0 w-full h-full object-contain z-10"
        />
        {/* Raios — saem da boca do megafone, só no hover */}
        <img
          src="/illustrations/raios.png"
          alt=""
          className="absolute bottom-0 left-0 w-20 h-20 object-contain z-20 opacity-0 scale-90 transition-all duration-300 -translate-y-3 translate-x-14 group-hover:-translate-y-8 group-hover:translate-x-20 group-hover:opacity-100 group-hover:scale-100"
        />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2 text-white">
          Mural de Avisos - GRE
        </h3>
        <p className="text-sm leading-relaxed mb-6 text-white">
          Veja os últimos avisos e comunicados.
        </p>
      </div>

      <div
        className="w-full rounded-full py-3 font-extrabold text-sm text-center transition-all group-hover:opacity-90 shadow-sm"
        style={{ background: '#ffffff', color: '#003b6f', border: '1px solid #cbe5ff' }}
      >
        Ler Comunicados
      </div>
    </a>
  )
}
