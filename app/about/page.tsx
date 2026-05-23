import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Discover the Bantu and Cameroonian roots that inspire BantuWear',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-charcoal py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-6xl text-gold mb-12 text-center">
          Our Story
        </h1>

        <div className="prose prose-invert prose-lg mx-auto">
          <p className="text-cream/80 leading-relaxed">
            BantuWear was born from a singular vision: to bring the rich textile heritage
            of the Bantu-speaking peoples of Central Africa to the global fashion stage.
            Rooted in the vibrant traditions of Cameroon, our brand celebrates the
            intersection of ancestral craftsmanship and contemporary design.
          </p>

          <h2 className="font-display text-2xl text-terracotta mt-12 mb-6">Heritage</h2>
          <p className="text-cream/80 leading-relaxed">
            The Bantu people have woven stories into fabric for millennia. From the
            intricate patterns of Kente cloth in Ghana to the bold geometry of Ankara
            wax prints across West and Central Africa, textile art has always been a
            language of identity, status, and spiritual connection.
          </p>

          <h2 className="font-display text-2xl text-terracotta mt-12 mb-6">Vision</h2>
          <p className="text-cream/80 leading-relaxed">
            We believe African fashion deserves to stand at the apex of global luxury,
            not as a trend, but as an enduring statement of cultural pride. Every
            BantuWear piece is designed to honor the hands that came before while
            embracing the technologies of tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
}
