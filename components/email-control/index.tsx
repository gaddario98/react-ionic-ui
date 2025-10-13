import React, { useCallback, useEffect, useRef } from "react";
import {
  ApplicationVerifier,
  ConfirmationResult,
  getAuth,
  linkWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
  reload,
  sendEmailVerification,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useAuthState } from "@gaddario98/react-auth";
import { useNotification } from "@gaddario98/react-notifications";
import { useBaseAnimation } from "../../hooks";
import { Alert } from "../alert";
import { useIonAlert } from "@ionic/react";
import { useTranslatedText } from "@gaddario98/react-localization";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const sendPhoneCode = async (phoneNumber: string) => {
  try {
    const auth = getAuth();
    auth.languageCode = "it";

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
      window.recaptchaVerifier.render();

      const appVerifier = window.recaptchaVerifier as ApplicationVerifier;
      const res = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = res;
    }
  } catch (err) {
    return new Error("Numero di telefono non valido o già in uso");
  }
};

const verifyPhoneNumber = async (verificationCode: string) => {
  try {
    if (window.confirmationResult) {
      const credential = PhoneAuthProvider.credential(
        window.confirmationResult.verificationId,
        verificationCode
      );
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        const res = await linkWithCredential(currentUser, credential);
        return res;
      }
    }
  } catch (err) {
    return new Error("Codice non valido");
  }
};

export const EmailNotVerifiedContainer: React.FC = () => {
  const [auth, setAuth] = useAuthState();
  const { showNotification } = useNotification();
  const [present] = useIonAlert();
  const [presentCheckCode] = useIonAlert();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { traslateText } = useTranslatedText("form");
  useBaseAnimation(containerRef);

  const handleSendNewEmail = useCallback(async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        showNotification({
          message: "confirmationEmailSent",
          type: "success",
          textTransOption: { ns: "auth" },
        });
      } catch {
        showNotification({
          message: "errorSendingEmail",
          type: "error",
          textTransOption: { ns: "auth" },
        });
      }
    }
  }, [showNotification]);

  const handleCheckAccount = useCallback(
    async (withNotification: boolean = true) => {
      const user = getAuth().currentUser;
      if (user) {
        try {
          await reload(user);
          const newUser = getAuth().currentUser;
          const token = await newUser?.getIdToken();
          if (newUser)
            setAuth({
              id: newUser?.uid,
              accountVerified: !!(
                newUser?.emailVerified || newUser?.phoneNumber
              ),
              isLogged: true,
              token,
            });
          if (newUser?.emailVerified) {
            showNotification({
              message: "emailVerified",
              type: "success"
            });
          } else {
            if (!withNotification) return;
            showNotification({
              message: "emailStillNotVerified",
              type: "warning"
            });
          }
        } catch {
          if (!withNotification) return;
          showNotification({
            message: "errorCheckingEmail",
            type: "error"
          });
        }
      }
    },
    [setAuth, showNotification]
  );

  const handleCheckWithPhone = useCallback(() => {
    present({
      header: traslateText("phoneVerification"),
      inputs: [
        {
          type: "tel",
          name: "phoneNumber",
          placeholder: traslateText("phoneNumber"),
          value: "+39",
        },
      ],
      buttons: [
        {
          text: traslateText("send", { ns: "buttons" }),
          handler: async (values) => {
            if (!values?.phoneNumber) {
              showNotification({
                message: "phoneNumberRequired",
                type: "error",
              });
              return false;
            }
            const phoneRegex = /^\+\d{1,4}\s?\d{6,14}$/;
            if (!phoneRegex.test(values.phoneNumber)) {
              showNotification({
                message: "invalidPhoneNumber",
                type: "error",
              });
              return false;
            }
            const check = await sendPhoneCode(values.phoneNumber);
            if (check instanceof Error) {
              showNotification({
                message: check.message,
                type: "error",
              });
              return false;
            }

            presentCheckCode({
              header: "Verifica Numero di telefono",
              inputs: [
                {
                  name: "code",
                  placeholder: "Inserisci codice di verifica",
                  type: "text",
                },
              ],
              buttons: [
                {
                  text: traslateText("send", { ns: "buttons" }),
                  handler: async (values) => {
                    if (!values?.code) {
                      showNotification({
                        message: "codeRequired",
                        type: "error",
                      });
                      return false;
                    }
                    const check = await verifyPhoneNumber(values.code);
                    if (check instanceof Error) {
                      showNotification({
                        message: check.message,
                        type: "error",
                      });
                      return false;
                    }
                    handleCheckAccount(false);
                    window.recaptchaVerifier?.clear();
                    return true;
                  },
                },
              ],
            });
          },
        },
      ],
      onDidDismiss: () => {},
    });
  }, []);

  useEffect(() => {
    if (auth?.id && !auth.accountVerified) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          handleCheckAccount(false);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [auth, handleCheckAccount]);

  if (!auth?.id || auth?.accountVerified) return;

  return (
    <div ref={containerRef}>
      <Alert
        message={{
          text: "emailNotVerified",
          translationOption: { ns: "form" },
        }}
        type="error"
        actions={[
          {
            text: "sendNewEmail",
            onClick: handleSendNewEmail,
            variant: "text",
            color: "light",
          },
          {
            text: "checkEmail",
            onClick: () => handleCheckAccount(),
            variant: "text",
            color: "light",
          },
          {
            text: "checkWithPhone",
            onClick: handleCheckWithPhone,
            variant: "text",
            color: "light",
          },
        ]}
      />
    </div>
  );
};
