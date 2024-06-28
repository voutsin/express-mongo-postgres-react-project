const NexGenLogoSVG = props => {
	const {
		light
	} = props;

    return light ? (
		<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 439 124" width="150" height="auto">
		<defs>
			<image  width="418" height="114" id="img1" href="data:image/png;base64,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"/></defs><style></style><use  href="#img1" x="10" y="5"/>
		</svg>
	) : (
        <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 439 124" width="150" height="auto">
		<defs>
			<image  width="418" height="114" id="img1" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaIAAAByCAYAAAARQtX0AAAAAXNSR0IB2cksfwAAFh5JREFUeJztnQ+wHVV9x5E/g/JPqUChFKQ4BEspjIJDhSkExzrSqgjTtFLJy91N3r3vJkQKlQoWy+7eQBv5NxLRxoJTSmkbFCnWShy1j733JQq59768EIExmQiNQMAmwhCLILunv999L8lLuO+9u+f8ds/ufd/PzG+AYd7Z3zm75/e5e+/Zs/vtBwAAAAAAAAAAAAAAAAAAAAAAAABgg6EFwXlDpdpciVgycNM708y1UqqdYpJfxfFOs52DrRhcEPxez31c6J1vejxuw3Ssk1IqeW+VGKuyE5yTde4AzGqGnOB/h9xASUTFDe5JM1dq/ytG+TnB101zGHL8L0uNV5ZBY/dggj4uEzluKXBNxzsJlPctImNV8q/UOb677icKgUBMH1NMXjkRDbl+NDjgzTGqJtMAEWUjonnz7j+AzuWY8TGdYGf58huPMx3zXhh0vHPpeLHxWDn+Gt0cbE9wBKII0XXyyIqoEw9pV5MZgIiyERFTdWunVhz/NfPCHvzAdMxnYunSOw6mYz1tPEYkzsXOshN087A9wRGIIkTXyZOCiFR1QXCWdlWZBogoOxF1+uoG14ocuxQsNh33afN0ghUyY+QvNMnD9gRHIIoQU01icRHRhG6YTOipgIiyFdF++6m30PXRND62479ann/DiaZj3w3+Sk5kjBx/tWkutic4AlGE6Dp50hARR9X1LzKd2PsCEWUtIv6KzjuZRSKQw4jp2O9LuewdMiTwlRzFDmrrKNN8bE9wBKII0XXypCUiKvobTCf2vkBE2YtovM/BFUI5XG06/pOhO++vSuRVdWsfl8jH9gRHIIoQXSdPWiIaL/z+ZRITfBcQkR0Rjfc7GBa4Hl7jOyzTc8CUXf9CoWv03yXyYWxPcASiCNF18qQqIjfY4nne/lITHSKyJ6LFJe9Y6vvLxrk4wWP825NJLq67/PAh139WIJcXSyXvHSa57JVXDiY5ApH36Dp50hTR+GT3q1ITHSKyJ6JO392gJJFL2Q0+Z5IHPzgtk0ftw6ZjMhnbExyBKEJ0nTxpi4iKxjZ+zkNiokNEdkU00f/V5vn4vy6XvPfoHL9Sqn1EZjz8uyTGYzK2JzgCUYToOnlSvyPqCMC/TmKiQ0T2RcSry6i9HQL5rOcdHJIcu/oXf3ckjf8LAtfjM7ziTmI8JmN7giMQRYiukycTEbnBS0s/5R1hOtHzICLK4U7z8fC30rg/kmm4fmDa913wKjOZayNZTvQ3q8wlFMR0Dj8gNRaTsT3BEYgiRPfJnYGIOuEEy00neh5EJHFHRP243TQP29D5vE9ARFF1wDujl+PRXczFEtdhmmNve4IjEHmPKSdPViLqPBQ53zvGZKJDRPmBV65RP54TuDaeKJdXHjTdsRznpqPpLnK7+TUYbJb6vRIAIEhmd0TjhWClSa4QUb6oOsEFIteF639huuPQndN3zI/jR2XHe19WYwMASEDGInpjqOSdpJsrRJQ/+MOFwHURV1zv7G7tD5X8+ULXXi3rsQEA9EiWIpqIVbq5QkT5g1ef8So0AVG86WszfpeRyEO0rj+WdIUeACBDLIhIDS30TtfJFSLKJ7wKTealdMGKye3yu4zMBcfbCtVOtTU2AIAesCEiKlzf1ckVIsov1KdbJa4Nfq0Dt1d1gkUi11rJ/6ztsQEAzICVOyIK/qE7aa4Cz/Bofy24Z7wgoqmgu48nBa6Npyul2in8tlTjtpygaXtMAAA9UHH9n5tNdv8f9Iqxvy55rrgjyjP8Zl4BEfG18UuJdqR2+gYApIypiMolfx618X29v/cvSZYrRJR3aIx9CYmYRtn1l9geCwBAj0iIyOCT8FNJXgkAEeUfXp3Gq9SsisgJhm2PAwAgAQK/Ef1Zpx3X/4aeHHyn11whomLAq9R4tZodCfkv87uTbI8BACABUiIaHPDmdB5YTVyU/a3eXO/AXnLtFxFlG/4rpn3Woez619joL10jAzb6CwAwQEpEDL/jRasNx7+ql1whouKIaGKs1mTaV8dfbauvAAADJEU0NLDs+M7mpkkF4frbe3k/DERULBEtdpadoHM9aMYOfleSrb4CAAyQFNF4e/4tmpLwZ8oVIiqWiCbGq5pFP/kdSTb7CQAwQFpE/BZNfhGehiR28t9OlytEVDwRjY9ZMJxmH+m83mu7jwAAA6RFxFBhuF6rLSf44nS5QkTFFBGvYpPZvLTLOXWD5/jdSLb7CAAwIA0RdXZkdoNtGkXldf6daapcIaJiiojh1Wxp9E9nqygAQM5IQ0QT7V6hJQs3uGeqXCGi4opo0aIbf1O8b3Ttzp9/86G2+wYAMCQtEfGzQSSOLRqFM+Jnkrq1CREVV0Qyb1ntdk79r9nuGwDAkLRExFDhv1yzzYe6tgcRFVJEVcdfkGYfK6XaR2z3EQBgQJoi4n3kqPhv0GmX96/btzWIqHgiknvL6jTh+C/MtOISAJBj0hURt1/7qJY0XL+xb1sQUfFEJPGW1d7Orf+vNvsJADAgbRExLBWdtquuf9He7UBERRJRVg+zTpLRxbb6CgAwIAsRDS0IztMUx4bJ7fSLiPp9922mPP+GEzPc3mdiXP3tjnPT0bb7boONw+qwdqjOb4Xq0nZDuRRXt8LIa4bRFynuaYXxQ80w/u9WPX6Y/v2BVj26l/7/Svrn7c1GVKO/W9IcURc26+o4230Bs5AsRMRQkfi25qfcy/a0AREVBernSJYS2hP+d2z3PQs2NNSRrYa6hCRzS7Met0gwSizC+BcUa0lUd7fq6oqxNer0LPvGImWJFi1Y5Cb9Hq2r88Ryqauq1PnomuuweodpjtzG7gazEtHQQu90XpqtUbS3eJ63P7cBERUD6t/VdiQ0ESV/vu0xSIP1oXov3cGsIFn8WFQ8vcWLJLz7ucDR3dPvptlPOs6Ihf4ZR7MeBSb9Jun/tWhODfWmBV9SjIXqd0zz4zZ2N5iViDrHcv1/0TqG43fsDhHln6rrnWztpXh7rpeXebWe7bGQoj2iLqLiPGy70O5VdMP4SSqcVzWb6u3S/YWIpPKJ37TgS4pii6jkndTZxid54d62dOkdB0NEeUe9ha6nx6xKaLeMgh/YHg0TlFIHUGG6nCbsmO0CO4OQXuXfoEZDda5U3yEiueAPMVLnZTKFFtHE8VZoHudaiCjf0Nj8jYRE6DxtlBGSP2h7THSgon4KFfhR24VVoxD/o0T/ISLBnMJ4w8xHTk7hRcR7jvErHzSK90uU632Ghel+0xMAEXWH+nSmjDyCkavm3fY2ukY2Cwht55KFy95le2ySwL/BUCH+P9tFVa8Qx/8hMwYQkWS0G+qymY+ejNyJqFzy5yXtBBWImlDRShqrTE8ARPRm5s27/wDq1xMS4uBl39xm2fHep7O4pZvYbI9PL/x4rfqNFi+tzkFB1S/EEJFJv9MSEd0VbVFK7S9xbnaROxENJbwjYpZ+yjuCn/nIWkT4ai4dqE83ipwjx69MblfqA0ul5F9pa2x6oRWqD9LEfMF2ITUvxBCR0XWQkojGc5Ndzt0XImKoyHwGIio+Fdc7W+TOpcvigvE7LX/M/Lz7r/JqPhvjMxOtMFpmu4DKFTuIyOhaSFNEYbxt0yZ1sMT5YfpGROOr4PytEFFxKZdXHiTxW850y62rbu1UkeXgTvAYr+rLeoymoxmqK20XT9lCDBGZ9DtNEY3np66TOD9M34iIqTrBIoiouNBY3CZxXvg1EdMdp1LyPyt0DVyb1djMBC+rpckY2S6esoUOIjLpd+oiCuOXNv1IHSFxjvpKRLxjAv39UxBR8Rh0vHNpPGPz89LLljyd55Oa5ufff61c8t6T/uhMT7uhzqRi+8vMCmQYv0r/fIGOubmzLDyM6xRP0H9vly3EEJFJv9MW0XhEyyXOUV+JiKk4tT+FiIpFuewdQv142nwcet+kdGLHBuNNVGns1/NvT2mP0VQ8HqoTSAbPp1sQ45cpvt4O1UBzWB01U07r16rjeTuY0bq6uF2PfBYKieqnEFH/iYg/lIytUceYnqO+ExFDBWkdRFQcTB8s3nM+/D9Pctyy6y8Rug78tMZmOsbG1KFUCB5PsdCsJqGIva2W823X1QW8gze1vaNIIhqXabE2Pc3mjogijFaanqO+FFHVrX2oKCKiInynuYj8rTTuj2Qebu0G0/6TDC4UORdu8KDO8akfw+bH96PqgHeG6VgkhT4x35pCYYnp7uVb7RF1dpq5q2F1IEnuo1TEVk181ZdrEVGujkQuWZKViOj8vTH6Q3WSSa59KSKGivP3iyCi4r0Yb68CbLSzhOsuP5zaeNY4D4NXey8ueccKvXr8CV71ZzIeSeCvQ6R3TODfmUZD9cdZ9WEXT42ow5sN9enWPs8+QURmZHZHxEEfKExy7VsRVRcEZ0FE+RYR9f2fRM5DqWb09RHdTQ2I5OH6XzDJIwmtenSzsIQ2r2+oOVnl3w1+LoXfV0R3ZD+DiMzJVEQsAoP3TPWtiDq5uP43IKJ8iojlIZTDP5ueg4nzsFrgeoj5gVyJfKaDFwxM9XWWpoQelVqGK0VHSPVohURbEFE2Qdfkd3Vz7WsRDQ54c6g4vAER5UtE/DUaf50mcPxn+es903PAlMveUdTmDoFrYjM/XC2R01TwkllBCW1v11Vfvw4dIsou+K2wOrn2tYiYiuvfBRHlS0S8sEDi+LzQwXT8J1N1ax8XGRcnEPkkPxX8IKFQ4Yhaj6g/TDPXPAARZRhhvE4n174X0dDAsuMlnheBiGRENLQw+KTI2Lv+V03Hvht0Tu+VyI8f0E0jv2ZDnSNVNNqhuj6NHPMGRJRxNNQlSXPtexGN5+TfAhHZFxE/bCq0S/rT/BCs6dh3g7/qozu25/KaY+cZE4FiQXdVW5XK1155aQERaV4jmjtl0N89lTRXXv5teo72WkKeRxHxbxKdF+FBRFZFxNvvSBw3rbuNXVSd4AKR68P175LOrRXGj8l8clXXSOeWV2axiK4x6jNfa2H8QBbjNSvuiBiSxvUQkT0RVRzfESrud5iOeU/5Su32YLi0fDJPPqre2eIHTk2Lahj/auOwOkwqr7wDEemLiJf0tzQ20+3ccQ+rA3vNddaIiL8moeKyDSLKXkT8Sgad17l3Ge/UV6TtzpmvF8d/xniMHP8FqZV97Yaab1xQ63LP5xQFiEhfRJ12wuhuvTbUVb3mOmtENJHbFRBR9iLil9QJjHUmz+hMhj64fEBkR3AnuE8in1Y9+jcREYUq12+YlUZkr7kw+vvRhpqbRawP1Xsl+m28WGFiBRxvYktj+LrGB57tzabq6XfSWSUib653IBWXLRBRdiKqlILFImOd4a4Fe+XvBDfLXCv+xaa5NMP4SQkR8WsjJMamKBRw9+01Ev2WEtH4GOrta8i7r/eSq7yIFgTnDZVqc3Wj1238dSkvqL3bJL/JUXG800zzqZRqp0jlk3X00v/BUvB+iWOZjrMJImPlBsbFX+R9P2H8C4kxKRIQkbmINjTUkfTfOzXa2Ml/O1Ou4iICAKSDSJEL42/a7kfWQETmIhofR/V5nXb4tR8z5QoRAVAAqAgcJ1Pkohtt9yVrICIhETXVITp35fz7Ev/ONF2uEBEABYB/15EpcnLPDzXr0ZezKs7NNerd+nlCRFrRZbuedl0t1Tp/YXTPdLlCRAAUgGaoPixT5NSgWE4Q0awTET8bxM8IabQXTfeaEYgIgAJAReVykYLeUPOkcoKIZp+IGO3n2cL4oalyhYgAKAD87I9EkRsdUX8klVMrjO7MqjibFBmISFZEvEch7yen1WZDndWtTYgIgAJAE7gsUeSadfUJqZxwRzQ7RdRpu6E+pnf9xY1u7UFEABSAVqguFSlyglvVQESzV0Sd9un/67TbHlEX7dsWRARAAWiH6nyJItduqKulcoKIZreI+G2sWucyjDfs2xZEBEABaNfVaSIFvRHVpHKCiGa3iDpjG8b/pdM2fSC6bHI7EBEABWBsjTpGpMiF0ZekcppNIpr4cf6RbCISedV8FiKi6/J0rfEM4y1Kqf13twMRAVAMWhLvIqrH35PKZzaJqKCvgUhdREwzjO7TOqd1Vd3VBkQEQEGQ2PSUPom+KvWKcIgo32QlIn5FN11Xb2hci9s2bVKd94tBRAAUBJpsoURRH31EvV8iH/pE+yetMPJmjHp0u2nOGxrqZP08IaI0RdQ5luYzZXQNXcd/DxEBUBBo0v6thIiaofpMpnk31InGOeOOKDFZioh/w+S77eTXYvzSph+pIyAiAAqC7nLZLpO/nWXeEJEdshTR+PGiG/WOFS2HiAAoCEqpA6g4vCIho9FQnZtV3hCRHbIWUbOp3s53OInPLd1J0TVyjvE1/UN1UkpDCQCYDBXVb0uIqBVGqzLLGSKyQtYiYvhrX83jrYaIACgIVFz+UkRE9TgaG1a/nUXOEJEdbIiIV8HxajihazRR4Ks5ADKCPnH+vuDkfTiTnCEiK9gQ0cRxByEiAPocKqyPSk3eLFbQQUR2sCUi3jGBd06AiADoY/idQnIiin+d9sIFiMgOtkTE8AsYISIA+pyW0MOtEzJ6abSh5qaVK0RkB5siYniXbYgIgD6Gd0eQnMS8RUuzrhalkStEZAfbIpK8c4eIAMgpNPkelp7MzTC6RWovul1ARHawLSKG38hqTUTuup8oBGK2h+kkngkqNGekMaE7rzwI1ZKxMXWoRJ4QkR3yICIat7MgIgTCYphO4p4muva2Kj0Voleo/a816+oTW9eqt+nkt76h5lBBvEa8yCSggC/G2x009p/X7XceRNTJI4wfgIgQCEshMYl7nOjfTL0gjm9o+Z/tUF1PdzifpiJXorumSyk+yAsdONoN9aFmqBbQ//scFx/6m+dTKzIJgIjsimj8w0gcpT1WEBEC0SUkJnEv/HRYvZWK/qjtoplqQbb91ZytfveBiDq5hNHdaY8VRIRAdAmpSdwLG4fVsVRwn7NdOFMryBBRYvIkovVr1fF0Hl5Pc6wgIgSiS0hN4l5pN9SZVDx+Zbt4plKQIaLE5ElE4+chujXNsYKIEIguITmJe6XzfFEY/8x2ARUvyBBRYvImog0NdSS1uTOtsYKIEIguITmJk9CZ8PX4e7aLqGhBhogSkzcRMdyftMYKIkIguoT0JE4CP5TKK9xaGaxWyqQgQ0SJyaWImuoQOh/b0xgriAiB6BLSk1gHktH5NElftF1QtYpwGL/BS9N5WbjJGEBE+RER066rpRARApFRpDGJdeBXOHee/wnjn9surD0K6PlmI6q1R9RvifQfIsqViNSwOpDO8VaICIHIINKYxCbw7gjNUF1Jhfl/bBfYKSKkT8ufJHEeJNlviChfImLoLnc+RIRAZBBpTWJT+BMp753W2VPOZqHlFVRh/FArVJXHQ3VCWv2FiPInIv4NU/r6g4gQiC6R1iSWhDdOnbhLepDfS5RBcW226tFtpr/7JAEiyp+IOvk11MdSFREAoJjwbskkpr/iOxUSU3vilc87khfQ+Blq41vtenQTf93GwrPdNwAAAAWns+hhjXoX7+DQWY03ov6A/503teRXPZBwjt44rA6znSeYvfw/JHdGJ2IMg8MAAAAASUVORK5CYII="/>
		</defs><style></style><use  href="#img1" x="10" y="5"/>
		</svg>
    )
}

export default NexGenLogoSVG;