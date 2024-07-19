import { Notify } from 'quasar';

export default {
  config: {
    notify: {}, // default set of options for Notify Quasar plugin
  },
  plugins: {
    Notify
  },
  extras: {
      font: 'roboto-font',
      fontIcons: [  
          'material-icons'
      ],
  },
};