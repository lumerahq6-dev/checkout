export interface Testimonial {
  name: string;
  role: string;
  message: string;
  rating: number;
  product: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Marcus R.",
    role: "YouTube Editor (1.2M subs)",
    message:
      "The Kaimatsu plugin changed how I work. Having every asset pack accessible right inside Premiere Pro saves me at least an hour per video. The automation tools alone are worth the subscription.",
    rating: 5,
    product: "Kaimatsu Pro Plugin",
  },
  {
    name: "Priya S.",
    role: "Freelance Video Editor",
    message:
      "I bought the Editor Essentials Bundle for client work and it paid for itself in the first week. The LUTs are cinematic, the transitions are smooth, and everything just drops in without hassle.",
    rating: 5,
    product: "Editor Essentials Bundle",
  },
  {
    name: "Tyler K.",
    role: "Short-Form Content Creator",
    message:
      "The Cinematic Transitions Pack is ridiculous. 120+ transitions that actually look professional, not the generic stuff you find for free. My TikToks and Reels look way more polished now.",
    rating: 5,
    product: "Cinematic Transitions Pack",
  },
  {
    name: "Jen W.",
    role: "Wedding Videographer",
    message:
      "The LUT Collection has become my go-to for every project. The warm film looks are gorgeous on wedding footage and the previews make it easy to pick the right grade fast.",
    rating: 5,
    product: "LUT Collection",
  },
  {
    name: "DanEdits",
    role: "Music Video Editor",
    message:
      "The Discord coaching is insane value. Kaimatsu actually reviews your timeline and gives real feedback — not generic advice. My editing speed and quality jumped within the first month.",
    rating: 5,
    product: "Discord Coaching",
  },
  {
    name: "Alex & Co Studio",
    role: "Production Team",
    message:
      "We run the plugin across our whole editing team. Having a shared asset library that syncs with the plugin keeps our projects consistent. Best investment we've made for our studio workflow.",
    rating: 5,
    product: "Kaimatsu Pro Plugin",
  },
];
