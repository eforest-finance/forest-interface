import Button from 'baseComponents/Button';

function Test() {
  // 'mini' | 'small' | 'medium' | 'large' | 'ultra'
  const size = 'ultra';
  return (
    <div className="flex justify-center overflow-auto items-center w-full h-screen">
      <div className="flex flex-col mr-4">
        <Button size={size} type="primary">
          Button Text
        </Button>
        <Button size={size} type="primary" disabled>
          Button Text
        </Button>
        <Button size={size} type="primary" danger>
          Button Text
        </Button>
        <Button size={size} type="primary" disabled danger>
          Button Text
        </Button>
        <Button size={size} type="primary" loading={true}>
          Button Text
        </Button>
        <Button size={size} type="primary" disabled loading={true}>
          Button Text
        </Button>
        <Button size={size} type="primary" disabled danger loading={true}>
          Button Text
        </Button>
        <Button size={size} type="primary" danger loading={true}>
          Button Text
        </Button>
      </div>

      <div className="flex flex-col mr-4">
        <Button size={size} type="default">
          Button Text
        </Button>
        <Button size={size} type="default" disabled>
          Button Text
        </Button>
        <Button size={size} type="default" danger>
          Button Text
        </Button>
        <Button size={size} type="default" disabled danger>
          Button Text
        </Button>
        <Button size={size} type="default" loading={true}>
          Button Text
        </Button>
        <Button size={size} type="default" disabled loading={true}>
          Button Text
        </Button>
        <Button size={size} type="default" disabled danger loading={true}>
          Button Text
        </Button>
        <Button size={size} type="default" danger loading={true}>
          Button Text
        </Button>
      </div>

      <div className="flex flex-col mr-4">
        <Button size={size} type="dashed">
          Button Text
        </Button>
        <Button size={size} type="dashed" disabled>
          Button Text
        </Button>
        <Button size={size} type="dashed" danger>
          Button Text
        </Button>
        <Button size={size} type="dashed" disabled danger>
          Button Text
        </Button>
        <Button size={size} type="dashed" loading={true}>
          Button Text
        </Button>
        <Button size={size} type="dashed" disabled loading={true}>
          Button Text
        </Button>
        <Button size={size} type="dashed" disabled danger loading={true}>
          Button Text
        </Button>
        <Button size={size} type="dashed" danger loading={true}>
          Button Text
        </Button>
      </div>

      <div className="flex flex-col mr-4">
        <Button size={size} type="link">
          Button Text
        </Button>
        <Button size={size} type="link" disabled>
          Button Text
        </Button>
        <Button size={size} type="link" danger>
          Button Text
        </Button>
        <Button size={size} type="link" disabled danger>
          Button Text
        </Button>
        <Button size={size} type="link" loading={true}>
          Button Text
        </Button>
        <Button size={size} type="link" disabled loading={true}>
          Button Text
        </Button>
        <Button size={size} type="link" disabled danger loading={true}>
          Button Text
        </Button>
        <Button size={size} type="link" danger loading={true}>
          Button Text
        </Button>
      </div>
    </div>
  );
}

export default Test;
