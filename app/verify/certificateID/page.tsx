
import dbConnect from "@/lib/db-connect";
import Certificate from "@/models/Certificate";
import { notFound } from "next/navigation";

interface Props {
  params: {
    certificateId: string;
  };
}

export default async function VerifyCertificate({ params }: Props) {
  await dbConnect();

  const certificate = await Certificate.findOne({
    certificateId: params.certificateId,
  }).lean();

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500">
            ❌ Invalid Certificate
          </h1>
          <p className="mt-4 text-gray-400">
            The certificate ID provided does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-green-400 mb-6">
          ✅ Certificate Verified
        </h1>

        <div className="space-y-3">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {certificate.participantName}
          </p>
          <p>
            <span className="font-semibold">Event:</span>{" "}
            {certificate.eventName}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {certificate.role}
          </p>
          <p>
            <span className="font-semibold">Issued On:</span>{" "}
            {new Date(certificate.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Certificate ID:</span>{" "}
            {certificate.certificateId}
          </p>
        </div>
      </div>
    </div>
  );
}
