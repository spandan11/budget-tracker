"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCurrencyModal } from "@/hooks/use-modal";
import Modal from "@/components/modals/Modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import { useRouter } from "next/navigation";

const CurrencyModal = () => {
  const storeModal = useCurrencyModal();
  const router = useRouter();
  const { user } = useUser();
  return (
    <Modal
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
      title={`Welcome, ${user?.firstName} 👋`}
      description="Choose your Preferred Currency"
    >
      <form className="flex flex-col gap-2 items-start justify-center w-full">
        <Card className="w-full">
          <CardContent className="py-4">
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <Button className="w-full" onClick={() => router.push("/")}>
          I&apos;m done take me to the dashboard
        </Button>
      </form>
    </Modal>
  );
};

export default CurrencyModal;
