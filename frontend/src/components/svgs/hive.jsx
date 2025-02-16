const XSvg = (props) => (
	<svg
	  aria-hidden="true"
	  viewBox="0 0 64 64"
	  {...props}
	>
	  <defs>
		<linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
		  <stop offset="0%" style={{ stopColor: "#FF6F91", stopOpacity: 1 }} />
		  <stop offset="100%" style={{ stopColor: "#FFCC99", stopOpacity: 1 }} />
		</linearGradient>
		<linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
		  <stop offset="0%" style={{ stopColor: "#6FB1FC", stopOpacity: 1 }} />
		  <stop offset="100%" style={{ stopColor: "#61C0BF", stopOpacity: 1 }} />
		</linearGradient>
	  </defs>
	  <g>
		<path
		  fill="url(#gradient1)"
		  d="M32 2L4 18v26l28 16 28-16V18L32 2z"
		/>
		<path
		  fill="url(#gradient2)"
		  d="M32 6l24 12v20L32 38l-24-12V18l24-12z"
		/>
		<circle cx="32" cy="32" r="8" fill="#FFD700" />
	  </g>
	</svg>
  );
  
  export default XSvg;
  