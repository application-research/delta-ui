import Select from '@components/basic/Select';

export default function DatasetSelect(props) {
  return (
    <Select placeholder={'select a dataset...'} {...props}>
      {props.datasets?.map((dataset, i) => {
        return (
          <option value={dataset.name} key={dataset.name}>{dataset.name}</option>
        );
      })}
    </Select>
  );
}