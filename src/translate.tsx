import * as hoistNonReactStatic from 'hoist-non-react-statics';
import * as React from 'react';
import { Component } from 'react';
import { PropTypes } from 'prop-types';
import { translate as translateI18next } from 'react-i18next';

export default function translate(...args: any[]) {
  if (!(window as any).PHRASEAPP_ENABLED) {
    return ((translateI18next as any)(...args))
  } else {
    return function (WrappedComponent: new() => React.Component<any, any>) {
      class TranslateWithPhraseApp extends React.Component<any, any> {
        phraseappConfig: any;
        public static contextTypes: any;

        constructor(props: any, context: any) {
          super(props, context);
          this.phraseappConfig = context.phraseappConfig;
        }

        decoratedKeyName(key: String) {
          var prefix = this.phraseappConfig.prefix ? this.phraseappConfig.prefix : "[[__";
          var suffix = this.phraseappConfig.suffix ? this.phraseappConfig.suffix : "__]]";

          return `${prefix}phrase_${key}${suffix}`
        }

        render () {
          return (
            <WrappedComponent {...this.props} t={(key) => this.decoratedKeyName(key)}/>
          )
        }
      }

      TranslateWithPhraseApp.contextTypes = {
        phraseappConfig: PropTypes.object.isRequired
      }

      return hoistNonReactStatic(TranslateWithPhraseApp, WrappedComponent)
    }
  }
}
