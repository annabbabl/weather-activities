const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],

  theme: {
    extend: {
      colors: {
        'customYellow': '#ffce32',
        'purpleCustom': '#3f3cbb',
        'good-background': '#F0FAFF',
        'good-thirdColor': '#1d4ed8',
        'good-secondaryColor': '#c7d2fe',
        'good-lightYellow': '#fef08a',
        'good-darkYellow': '#facc15',
        'bad-background': '#C3CEDA',
        'bad-extraLight': '15%',
        'bad-middle': '31%',
        'bad-darker': '59%',
        'snow-background': '#E8EEF1',
        'snow-secondaryColor': '#738FA7',
        'snow-thirdColor': '#0C4160',
        'snow-forthColor': '#071330'
      }
    }
  },
  plugins: [],
});
