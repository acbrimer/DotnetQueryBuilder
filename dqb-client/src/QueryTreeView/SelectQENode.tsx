import React from "react";
import QENode from "./QENode";
import QEItem from "./QEItem";
import ColumnNode from "./ColumnNode";

type SelectQEProps = {
  node: ISelectQE;
  nodeId: any;
};

const SelectQENode = (props: SelectQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEItem nodeId={nodeId} label="Select">
      <QEItem nodeId={`${nodeId}.columns`} label="Columns">
        {node.columns.map((c, ix) => (
          <ColumnNode
            ordinalPosition={ix}
            nodeId={`${nodeId}.columns[${ix}]`}
            node={c}
          />
        ))}
      </QEItem>
      <QEItem label="From" nodeId={`${nodeId}-from`}>
        <QENode nodeId={`${nodeId}.fromClause`} node={node.fromClause} />
        {node.joinClause && node.joinClause.length > 0 && (
          <>
            {node.joinClause.map((j, ix) => (
              <QENode node={j} nodeId={`${nodeId}.joinClause[${ix}]`} />
            ))}
          </>
        )}
      </QEItem>
      <QEItem label="Where" nodeId={`${nodeId}-where`}>
        {node.whereClause && (
          <QENode node={node.whereClause} nodeId={`${nodeId}.whereClause`} />
        )}
      </QEItem>
    </QEItem>
  );
};

export default SelectQENode;
