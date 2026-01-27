'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, Input } from '@heroui/react';
import { MdEnhancedEncryption } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getArticleDataAPI } from '@/api/article';
import { toast, ToastContainer } from 'react-toastify';

interface Props {
  id: number;
}

export default function Encrypt({ id }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [password, setPassword] = useState('');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const inputRef = useRef<HTMLInputElement>(null);

  // 在模态框打开后自动聚焦到 Input 组件
  useEffect(() => {
    onOpen();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 验证访问密码
  const handleVerifyPassword = async () => {
    const res = await getArticleDataAPI(id, password);

    if (res?.code === 200) {
      router.push(`${pathname}?password=${password}`);
    } else {
      toast.error('访问密码错误，请重新输入');
    }
  };

  // 表单样式
  const inputWrapper = 'hover:!border-primary group-data-[focus=true]:border-primary rounded-md';

  return (
    <>
      <Modal isOpen={isOpen} backdrop="blur" placement="top-center" isDismissable={false} hideCloseButton={true} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">🔑 该文章已加密</ModalHeader>

              <ModalBody>
                <Input
                  ref={inputRef}
                  classNames={{ inputWrapper }}
                  endContent={<MdEnhancedEncryption className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                  label="访问密码"
                  type="password"
                  placeholder="文章受保护，请输入密码"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.code === 'Enter') {
                      handleVerifyPassword();
                    }
                  }}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="default" onPress={() => router.push('/')}>
                  返回
                </Button>
                <Button color="primary" onPress={handleVerifyPassword}>
                  校验
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ToastContainer />
    </>
  );
}
