import * as React from "react";
import QEColumn from "./QEColumn";
import QEItem from "./QEItem";
import QENode from "./QENode";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PropertyNode from "./PropertyNode";
import { SelectInput } from "react-admin";

type BinaryQEProps = {
  node: IBinaryQE;
  nodeId: any;
};

const BinaryQENode = (props: BinaryQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEColumn
      columnType="calc"
      label={`${node.alias ? node.alias : "(unnamed)"} [${node._type}]`}
      nodeId={nodeId}
      expandIcon={<ArrowDropUpIcon fontSize="inherit" />}
      collapseIcon={<ArrowDropDownIcon fontSize="inherit" />}
    >
      <PropertyNode
        qeName="Alias"
        qeValue={node.alias}
        nodeId={`${nodeId}.alias`}
      />
      <QENode node={node.left} nodeId={`${nodeId}.left`} />
      <PropertyNode
        qeName="Operator"
        qeValue={node.operator}
        nodeId={`${nodeId}.operator`}
        InputComponent={
          <SelectInput
            sx={{
              width: 100,
              minWidth: 100,
              textAlign: "center",
            }}
            label="Operator"
            defaultValue="add"
            helperText={false}
            emptyValue={"𝑓(a,b)"}
            choices={[
              { id: "add", name: "+" },
              { id: "subtract", name: "-" },
              { id: "multiply", name: "*" },
              { id: "divide", name: "/" },
            ]}
          />
        }
      />
      <QENode node={node.right} nodeId={`${nodeId}.right`} />
    </QEColumn>
  );
};

export default BinaryQENode;
