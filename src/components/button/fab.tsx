import React from 'react';
import {FAB as FABPaper} from 'react-native-paper';
import {useThemePaper} from '../../theme/use-theme';

type FabProps = typeof FABPaper.defaultProps & {
  icon: string;
};

export default function Fab(props: FabProps) {
  const themePaper = useThemePaper();
  return (
    <FABPaper
      {...props}
      color={props?.color || themePaper.colors.text}
      style={[{backgroundColor: themePaper.colors.primary}, props?.style]}
    />
  );
}
