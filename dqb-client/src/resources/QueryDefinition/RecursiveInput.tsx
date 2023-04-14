import * as React from "react";
import { useInput } from "react-admin";
import { InputProps } from "ra-core";

type RecursiveInputProps = InputProps & {
  children?: React.ReactNode;
};

const RecursiveInput: React.FC<RecursiveInputProps> = (props) => {
  const { children, source } = props;
  const {
    field: { value, onChange },
  } = useInput(props);

  const handleChange = (newValues: any) => {
    const newValue = { ...value, ...newValues };
    onChange(newValue);
  };

  const childInputs = React.Children.map(children, (child: any) => {
    if (child && child.props) {
      const { source: childSource } = child.props as RecursiveInputProps;
      return (
        <RecursiveInput
          source={`${source}.${childSource}`}
          onChange={handleChange}
        >
          {child}
        </RecursiveInput>
      );
    }
  });

  return <div>{childInputs}</div>;
};

export default RecursiveInput;
