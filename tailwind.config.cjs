const GlassmorphismPlugin = ({ addComponents }) => {
	addComponents({
		'.glassmorphism': {
			background: 'radial-gradient(ellipse at 0% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.4) 100%)',
			border: '1px solid rgba(255, 255, 255, 0.5)',
			boxShadow: '0 0 16px rgba(0, 0, 0, 0.25)',
			backdropFilter: 'blur(12px)',
		},
	})
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [GlassmorphismPlugin],
}
