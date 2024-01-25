import Button from 'baseComponents/Button';
import Input, { InputNumber, TextArea } from 'baseComponents/Input';

function Test() {
  // 'mini' | 'small' | 'medium' | 'large' | 'ultra'
  const sizeButton = 'ultra';
  // middle | small
  const sizeInput = 'middle';

  return (
    <div>
      <div className="flex justify-center overflow-auto items-center w-full h-screen">
        <div className="w-[400px]">
          <Input placeholder="test input" size={sizeInput} className="mb-[16px]" />
          <Input placeholder="test input" size={sizeInput} status="error" className="mb-[16px]" />
          <Input value="test input" size={sizeInput} disabled className="mb-[16px]" />
          <Input value="test input" size={sizeInput} status="error" disabled className="mb-[16px]" />

          <TextArea placeholder="test input" className="mb-[16px]" />
          <TextArea placeholder="test input" status="error" className="mb-[16px]" />
          <TextArea value="test input" disabled className="mb-[16px]" />
          <TextArea value="test input" status="error" disabled className="mb-[16px]" />

          <InputNumber placeholder="test input" className="w-[400px] mb-[16px]" />
          <InputNumber placeholder="test input" status="error" className="w-[400px] mb-[16px]" />
          <InputNumber value="test input" disabled className="w-[400px] mb-[16px]" />
          <InputNumber value="test input" status="error" disabled className="w-[400px] mb-[16px]" />
        </div>
      </div>
      <div className="flex justify-center overflow-auto items-center w-full h-screen">
        <div className="flex flex-col mr-4">
          <Button size={sizeButton} type="primary">
            Button Text
          </Button>
          <Button size={sizeButton} type="primary" disabled>
            Button Text
          </Button>
          <Button size={sizeButton} type="primary" danger>
            Button Text
          </Button>
          <Button size={sizeButton} type="primary" disabled danger>
            Button Text
          </Button>
          <Button size={sizeButton} type="primary" loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="primary" disabled loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="primary" disabled danger loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="primary" danger loading={true}>
            Button Text
          </Button>
        </div>

        <div className="flex flex-col mr-4">
          <Button size={sizeButton} type="default">
            Button Text
          </Button>
          <Button size={sizeButton} type="default" disabled>
            Button Text
          </Button>
          <Button size={sizeButton} type="default" danger>
            Button Text
          </Button>
          <Button size={sizeButton} type="default" disabled danger>
            Button Text
          </Button>
          <Button size={sizeButton} type="default" loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="default" disabled loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="default" disabled danger loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="default" danger loading={true}>
            Button Text
          </Button>
        </div>

        <div className="flex flex-col mr-4">
          <Button size={sizeButton} type="dashed">
            Button Text
          </Button>
          <Button size={sizeButton} type="dashed" disabled>
            Button Text
          </Button>
          <Button size={sizeButton} type="dashed" danger>
            Button Text
          </Button>
          <Button size={sizeButton} type="dashed" disabled danger>
            Button Text
          </Button>
          <Button size={sizeButton} type="dashed" loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="dashed" disabled loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="dashed" disabled danger loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="dashed" danger loading={true}>
            Button Text
          </Button>
        </div>

        <div className="flex flex-col mr-4">
          <Button size={sizeButton} type="link">
            Button Text
          </Button>
          <Button size={sizeButton} type="link" disabled>
            Button Text
          </Button>
          <Button size={sizeButton} type="link" danger>
            Button Text
          </Button>
          <Button size={sizeButton} type="link" disabled danger>
            Button Text
          </Button>
          <Button size={sizeButton} type="link" loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="link" disabled loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="link" disabled danger loading={true}>
            Button Text
          </Button>
          <Button size={sizeButton} type="link" danger loading={true}>
            Button Text
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Test;
